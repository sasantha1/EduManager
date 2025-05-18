"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, Plus, Trash2, Loader2 } from "lucide-react"
import { api, tokenUtils } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function NewCoursePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    teacherId: "",
    schedules: [
      {
        day: "MONDAY",
        startTime: "10:00:00",
        endTime: "12:00:00",
        room: "A101"
      }
    ]
  })

  const daysOfWeek = [
    "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"
  ]

  const timeOptions = Array.from({ length: 24 * 4 }).map((_, index) => {
    const hour = Math.floor(index / 4)
    const minute = (index % 4) * 15
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`
  })

  // Get teacher's ID when component loads
  useEffect(() => {
    const fetchTeacherProfile = async () => {
      try {
        const userData = tokenUtils.getUserData()
        if (!userData || !userData.id) {
          toast({
            title: "Authentication error",
            description: "Please log in again to create a course.",
            variant: "destructive",
          })
          router.push('/login')
          return
        }

        // Fetch teacher profile to get the teacherId
        const response = await api.protected.fetchWithAuth(`/teachers/${userData.id}`)
        
        if (response.success && response.data) {
          // Use the teacherId from the profile (format: T1234)
          setFormData(prev => ({
            ...prev,
            teacherId: response.data.teacherId
          }))
        } else {
          throw new Error(response.message || "Failed to fetch teacher information")
        }
      } catch (error) {
        console.error("Error fetching teacher profile:", error)
        toast({
          title: "Error",
          description: "Failed to load your teacher information. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeacherProfile()
  }, [router, toast])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedules = [...formData.schedules]
    updatedSchedules[index] = {
      ...updatedSchedules[index],
      [field]: value
    }
    setFormData({ ...formData, schedules: updatedSchedules })
  }

  const addSchedule = () => {
    setFormData({
      ...formData,
      schedules: [
        ...formData.schedules,
        {
          day: "MONDAY",
          startTime: "10:00:00",
          endTime: "12:00:00",
          room: "A101"
        }
      ]
    })
  }

  const removeSchedule = (index) => {
    if (formData.schedules.length <= 1) {
      toast({
        title: "Cannot remove",
        description: "A course must have at least one schedule",
        variant: "destructive",
      })
      return
    }
    
    const updatedSchedules = formData.schedules.filter((_, i) => i !== index)
    setFormData({ ...formData, schedules: updatedSchedules })
  }

  const validateForm = () => {
    // Check course code format (2-4 uppercase letters followed by 3-4 digits)
    const codeRegex = /^[A-Z]{2,4}\d{3,4}$/
    if (!codeRegex.test(formData.code)) {
      toast({
        title: "Invalid course code",
        description: "Course code should be in format like 'CS101' or 'MATH2001'",
        variant: "destructive",
      })
      return false
    }

    // Validate that all schedules have valid times (start time before end time)
    for (let i = 0; i < formData.schedules.length; i++) {
      const { startTime, endTime } = formData.schedules[i]
      if (startTime >= endTime) {
        toast({
          title: "Invalid schedule time",
          description: `Schedule #${i+1}: End time must be after start time`,
          variant: "destructive",
        })
        return false
      }
    }

    // Check if teacherId is available
    if (!formData.teacherId) {
      toast({
        title: "Missing teacher information",
        description: "Your teacher ID couldn't be retrieved. Please try again or contact support.",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)

    try {
      console.log("Submitting course data:", formData)
      
      // Submit the course creation request
      const response = await api.protected.fetchWithAuth('/courses', {
        method: 'POST',
        body: JSON.stringify(formData),
      })

      if (response.success) {
        toast({
          title: "Course created",
          description: "Your new course has been created successfully.",
        })
        router.push('/dashboard/teacher/courses')
      } else {
        throw new Error(response.message || "Failed to create course")
      }
    } catch (error) {
      console.error("Error creating course:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create the course. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading teacher information...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-3xl">
      <div className="flex items-center">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="mr-2">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Create New Course</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Course details section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Course Code <span className="text-xs text-muted-foreground">(Format: CS101, MATH2001)</span></Label>
                <Input
                  id="code"
                  name="code"
                  placeholder="e.g. CS101"
                  value={formData.code}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Course Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. Introduction to Computer Science"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Course Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Provide a description of the course"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>
              {/* Display teacher ID for reference (cannot be changed) */}
              <div className="space-y-2">
                <Label htmlFor="teacherId">Teacher ID</Label>
                <Input
                  id="teacherId"
                  name="teacherId"
                  value={formData.teacherId}
                  readOnly
                  disabled
                />
                <p className="text-xs text-muted-foreground">This course will be assigned to your teacher account</p>
              </div>
            </div>

            {/* Schedule section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Course Schedule</h3>
                <Button type="button" variant="outline" size="sm" onClick={addSchedule}>
                  <Plus className="h-4 w-4 mr-1" /> Add Schedule
                </Button>
              </div>
              
              <div className="space-y-4">
                {formData.schedules.map((schedule, index) => (
                  <div key={index} className="p-4 border rounded-md">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Schedule #{index + 1}</h4>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeSchedule(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`day-${index}`}>Day</Label>
                        <Select
                          value={schedule.day}
                          onValueChange={(value) => handleScheduleChange(index, 'day', value)}
                        >
                          <SelectTrigger id={`day-${index}`}>
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                          <SelectContent>
                            {daysOfWeek.map((day) => (
                              <SelectItem key={day} value={day}>
                                {day.charAt(0) + day.slice(1).toLowerCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`room-${index}`}>Room</Label>
                        <Input
                          id={`room-${index}`}
                          value={schedule.room}
                          onChange={(e) => handleScheduleChange(index, 'room', e.target.value)}
                          placeholder="e.g. A101"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`startTime-${index}`}>Start Time</Label>
                        <Select
                          value={schedule.startTime}
                          onValueChange={(value) => handleScheduleChange(index, 'startTime', value)}
                        >
                          <SelectTrigger id={`startTime-${index}`}>
                            <SelectValue placeholder="Select start time" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px] overflow-y-auto">
                            {timeOptions.map((time) => (
                              <SelectItem key={`start-${time}`} value={time}>
                                {time.substring(0, 5)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`endTime-${index}`}>End Time</Label>
                        <Select
                          value={schedule.endTime}
                          onValueChange={(value) => handleScheduleChange(index, 'endTime', value)}
                        >
                          <SelectTrigger id={`endTime-${index}`}>
                            <SelectValue placeholder="Select end time" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px] overflow-y-auto">
                            {timeOptions.map((time) => (
                              <SelectItem key={`end-${time}`} value={time}>
                                {time.substring(0, 5)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Course"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}