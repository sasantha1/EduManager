"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { api } from "@/lib/api"

interface Teacher {
  id: number
  name: string
  email: string
  teacherId: string
  department: string
}

interface ScheduleRequest {
  day: string
  startTime: string
  endTime: string
  room: string
}

interface CourseRequest {
  name: string
  code: string
  description: string
  teacherId: string
  schedules: ScheduleRequest[]
}

const DAYS_OF_WEEK = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]

export default function AddCoursePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [formData, setFormData] = useState<CourseRequest>({
    name: "",
    code: "",
    description: "",
    teacherId: "",
    schedules: [{ day: "MONDAY", startTime: "", endTime: "", room: "" }],
  })

  const router = useRouter()
  const { toast } = useToast()

  // Fetch teachers when component mounts
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await api.protected.fetchWithAuth("/teachers")
        if (response.success) {
          setTeachers(response.data)
        }
      } catch (error) {
        console.error("Error fetching teachers:", error)
        toast({
          title: "Error",
          description: "Failed to load teachers. Please try again later.",
          variant: "destructive",
        })
      }
    }

    fetchTeachers()
  }, [toast])

  const handleInputChange = (field: keyof CourseRequest, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleScheduleChange = (index: number, field: keyof ScheduleRequest, value: string) => {
    setFormData((prev) => {
      const newSchedules = [...prev.schedules]
      newSchedules[index] = {
        ...newSchedules[index],
        [field]: value,
      }
      return {
        ...prev,
        schedules: newSchedules,
      }
    })
  }

  const addSchedule = () => {
    setFormData((prev) => ({
      ...prev,
      schedules: [...prev.schedules, { day: "MONDAY", startTime: "", endTime: "", room: "" }],
    }))
  }

  const removeSchedule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      schedules: prev.schedules.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await api.protected.fetchWithAuth("/courses", {
        method: "POST",
        body: JSON.stringify(formData),
      })

      if (response.success) {
        toast({
          title: "Success",
          description: "Course has been created successfully.",
        })
        router.push("/dashboard/admin/courses")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create course. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Add New Course</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
          <CardDescription>Enter the details for the new course.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Course Name</label>
                <Input
                  required
                  placeholder="e.g., Introduction to Programming"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Course Code</label>
                <Input
                  required
                  placeholder="e.g., CS101"
                  value={formData.code}
                  onChange={(e) => handleInputChange("code", e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  required
                  placeholder="Enter course description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Instructor</label>
                <Select value={formData.teacherId} onValueChange={(value) => handleInputChange("teacherId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an instructor" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.teacherId} value={teacher.teacherId}>
                        {teacher.name} - {teacher.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Schedule</h3>
                <Button type="button" variant="outline" size="sm" onClick={addSchedule}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Time Slot
                </Button>
              </div>

              {formData.schedules.map((schedule, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Day</label>
                    <Select
                      value={schedule.day}
                      onValueChange={(value) => handleScheduleChange(index, "day", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS_OF_WEEK.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Time</label>
                    <Input
                      type="time"
                      required
                      value={schedule.startTime}
                      onChange={(e) => handleScheduleChange(index, "startTime", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Time</label>
                    <Input
                      type="time"
                      required
                      value={schedule.endTime}
                      onChange={(e) => handleScheduleChange(index, "endTime", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Room</label>
                    <div className="flex gap-2">
                      <Input
                        required
                        placeholder="e.g., Room 101"
                        value={schedule.room}
                        onChange={(e) => handleScheduleChange(index, "room", e.target.value)}
                      />
                      {formData.schedules.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSchedule(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Course"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
