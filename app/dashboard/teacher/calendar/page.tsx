"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { api, tokenUtils } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function TeacherCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState("week")
  const [events, setEvents] = useState([])
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Initial load of courses and creation of events
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const userData = tokenUtils.getUserData()
        if (!userData || !userData.id) {
          toast({
            title: "Authentication error",
            description: "Please log in again to view your calendar.",
            variant: "destructive",
          })
          return
        }

        // Fetch the teacher's courses
        const response = await api.protected.fetchWithAuth(`/courses/teacher/${userData.id}`)
        console.log("Teacher courses:", response)
        
        if (response.success && response.data) {
          const fetchedCourses = response.data
          setCourses(fetchedCourses)
          
          // Generate events from the course schedules
          const generatedEvents = generateEventsFromCourses(fetchedCourses)
          setEvents(generatedEvents)
        } else {
          toast({
            title: "Error fetching courses",
            description: "Could not retrieve your courses for the calendar.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching courses:", error)
        toast({
          title: "Error",
          description: "Failed to load your courses. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [toast])

  // Generate calendar events from course schedules
  const generateEventsFromCourses = (courses) => {
    const events = []
    let eventId = 1

    // Current real date to use as a reference
    const referenceDate = new Date(2025, 4, 17) // May 17, 2025
    const refDay = referenceDate.getDay() // 0-6: 0 = Sunday
    
    courses.forEach(course => {
      if (course.schedules && course.schedules.length > 0) {
        course.schedules.forEach(schedule => {
          // Map day string to number (0-6)
          const dayMap = {
            'SUNDAY': 0, 'MONDAY': 1, 'TUESDAY': 2, 'WEDNESDAY': 3,
            'THURSDAY': 4, 'FRIDAY': 5, 'SATURDAY': 6
          }
          
          const scheduleDay = dayMap[schedule.day]
          if (scheduleDay === undefined) return // Skip if day is invalid
          
          // Calculate the date for this week's occurrence of the scheduled day
          const daysToAdd = (scheduleDay - refDay + 7) % 7
          const eventDate = new Date(referenceDate)
          eventDate.setDate(referenceDate.getDate() + daysToAdd)
          
          // Parse the time
          const startParts = schedule.startTime.split(':')
          const endParts = schedule.endTime.split(':')
          
          const startHour = parseInt(startParts[0])
          const startMinute = parseInt(startParts[1])
          const endHour = parseInt(endParts[0])
          const endMinute = parseInt(endParts[1])
          
          // Create start and end dates
          const start = new Date(eventDate)
          start.setHours(startHour, startMinute, 0, 0)
          
          const end = new Date(eventDate)
          end.setHours(endHour, endMinute, 0, 0)
          
          // Create the event
          events.push({
            id: eventId++,
            title: `${course.code} Lecture`,
            description: course.description,
            start,
            end,
            location: schedule.room,
            type: "lecture",
            courseCode: course.code,
            courseId: course.id
          })
          
          // Also create events for next 3 weeks
          for (let i = 1; i <= 3; i++) {
            const nextWeekStart = new Date(start)
            nextWeekStart.setDate(start.getDate() + (i * 7))
            
            const nextWeekEnd = new Date(end)
            nextWeekEnd.setDate(end.getDate() + (i * 7))
            
            events.push({
              id: eventId++,
              title: `${course.code} Lecture`,
              description: course.description,
              start: nextWeekStart,
              end: nextWeekEnd,
              location: schedule.room,
              type: "lecture",
              courseCode: course.code,
              courseId: course.id
            })
          }
        })
        
        // Add some mock deadlines for assignments
        const assignmentDate = new Date(referenceDate)
        assignmentDate.setDate(referenceDate.getDate() + 10 + (course.id % 5))
        assignmentDate.setHours(23, 59, 0, 0)
        
        events.push({
          id: eventId++,
          title: `${course.code} Assignment Due`,
          description: `Assignment for ${course.name}`,
          start: assignmentDate,
          end: assignmentDate,
          location: null,
          type: "deadline",
          courseCode: course.code,
          courseId: course.id
        })
      }
    })
    
    // Add some office hours and meetings
    const officeHoursDate = new Date(referenceDate)
    officeHoursDate.setDate(referenceDate.getDate() + 1)
    officeHoursDate.setHours(14, 0, 0, 0)
    
    const officeHoursEndDate = new Date(officeHoursDate)
    officeHoursEndDate.setHours(16, 0, 0, 0)
    
    events.push({
      id: eventId++,
      title: "Office Hours",
      description: "Open office hours for students",
      start: officeHoursDate,
      end: officeHoursEndDate,
      location: "Faculty Office",
      type: "office-hours",
      courseCode: null
    })
    
    const meetingDate = new Date(referenceDate)
    meetingDate.setDate(referenceDate.getDate() + 2)
    meetingDate.setHours(10, 0, 0, 0)
    
    const meetingEndDate = new Date(meetingDate)
    meetingEndDate.setHours(11, 30, 0, 0)
    
    events.push({
      id: eventId++,
      title: "Department Meeting",
      description: "Weekly department meeting",
      start: meetingDate,
      end: meetingEndDate,
      location: "Admin Building, Room 200",
      type: "meeting",
      courseCode: null
    })
    
    return events
  }

  // Set current date to match the example events (May 17, 2025)
  useEffect(() => {
    const today = new Date(2025, 4, 17) // May 17, 2025
    setCurrentDate(today)
  }, [])

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const getWeekDates = (date) => {
    const day = date.getDay()
    const diff = date.getDate() - day
    const weekDates = []

    for (let i = 0; i < 7; i++) {
      const newDate = new Date(date)
      newDate.setDate(diff + i)
      weekDates.push(newDate)
    }

    return weekDates
  }

  const getMonthDates = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()

    const startOffset = firstDay.getDay()
    const endOffset = 6 - lastDay.getDay()

    const monthDates = []

    // Add days from previous month
    for (let i = startOffset - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      monthDates.push(prevDate)
    }

    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i)
      monthDates.push(currentDate)
    }

    // Add days from next month
    for (let i = 1; i <= endOffset; i++) {
      const nextDate = new Date(year, month + 1, i)
      monthDates.push(nextDate)
    }

    return monthDates
  }

  const navigatePrevious = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    setCurrentDate(newDate)
  }

  const navigateNext = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const navigateToday = () => {
    setCurrentDate(new Date(2025, 4, 17)) // Set to May 17, 2025 (now using our reference date)
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  const getEventsForDate = (date) => {
    return events.filter((event) => isSameDay(event.start, date))
  }

  const getEventTypeColor = (type) => {
    switch (type) {
      case "lecture":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "office-hours":
        return "bg-green-100 text-green-800 border-green-200"
      case "meeting":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "deadline":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const renderWeekView = () => {
    const weekDates = getWeekDates(currentDate)
    const startDate = weekDates[0]
    const endDate = weekDates[6]

    const formattedDateRange = `${startDate.getDate()} ${months[startDate.getMonth()]} - ${endDate.getDate()} ${months[endDate.getMonth()]} ${endDate.getFullYear()}`

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{formattedDateRange}</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={navigatePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={navigateToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={navigateNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {weekDates.map((date, index) => {
            const isToday = isSameDay(date, new Date(2025, 4, 17)) // Compare with our "today" (May 17, 2025)
            const dayEvents = getEventsForDate(date)

            return (
              <div key={index} className={`space-y-2 ${isToday ? "bg-blue-50 rounded-lg p-2" : ""}`}>
                <div className="text-center">
                  <div className="text-sm font-medium">{daysOfWeek[date.getDay()]}</div>
                  <div className={`text-2xl ${isToday ? "font-bold text-blue-600" : ""}`}>{date.getDate()}</div>
                </div>

                <div className="space-y-2">
                  {dayEvents.map((event) => (
                    <div key={event.id} className={`p-2 rounded-md border ${getEventTypeColor(event.type)}`}>
                      <div className="font-medium text-sm">{event.title}</div>
                      {event.start.getHours() !== 23 && (
                        <div className="flex items-center gap-1 text-xs mt-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {formatTime(event.start)} - {formatTime(event.end)}
                          </span>
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-1 text-xs mt-1">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.courseCode && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {event.courseCode}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderMonthView = () => {
    const monthDates = getMonthDates(currentDate)
    const formattedMonth = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{formattedMonth}</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={navigatePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={navigateToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={navigateNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center font-medium p-2">
              {day.substring(0, 3)}
            </div>
          ))}

          {monthDates.map((date, index) => {
            const isCurrentMonth = date.getMonth() === currentDate.getMonth()
            const isToday = isSameDay(date, new Date(2025, 4, 17)) // Compare with our "today" (May 17, 2025)
            const dayEvents = getEventsForDate(date)

            return (
              <div
                key={index}
                className={`min-h-[100px] p-1 border ${isCurrentMonth ? "" : "bg-gray-50"} ${isToday ? "bg-blue-50" : ""}`}
              >
                <div className={`text-right text-sm ${isToday ? "font-bold text-blue-600" : ""}`}>{date.getDate()}</div>

                <div className="mt-1 space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className={`p-1 rounded text-xs truncate ${getEventTypeColor(event.type)}`}>
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-center text-muted-foreground">+{dayEvents.length - 3} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    type: "lecture",
    courseCode: "",
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewEvent((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddEvent = () => {
    // Validate the form
    if (!newEvent.title || !newEvent.date || !newEvent.startTime) {
      toast({
        title: "Missing information",
        description: "Please provide at least a title, date, and start time.",
        variant: "destructive",
      })
      return
    }

    try {
      // Create the event object
      const [year, month, day] = newEvent.date.split("-").map(num => parseInt(num))
      const [startHours, startMinutes] = newEvent.startTime.split(":").map(num => parseInt(num))
      
      const start = new Date(year, month - 1, day, startHours, startMinutes)
      
      let end
      if (newEvent.endTime) {
        const [endHours, endMinutes] = newEvent.endTime.split(":").map(num => parseInt(num))
        end = new Date(year, month - 1, day, endHours, endMinutes)
      } else {
        // Default to 1 hour later if no end time is provided
        end = new Date(start)
        end.setHours(start.getHours() + 1)
      }
      
      // Create a new event
      const newEventObj = {
        id: events.length + 1,
        title: newEvent.title,
        description: newEvent.description,
        start,
        end,
        location: newEvent.location,
        type: newEvent.type,
        courseCode: newEvent.courseCode,
      }
      
      // Add the event to the list
      setEvents(prev => [...prev, newEventObj])
      
      toast({
        title: "Event created",
        description: "Your new event has been added to the calendar.",
      })
      
      // Close dialog and reset form
      setIsDialogOpen(false)
      setNewEvent({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        location: "",
        type: "lecture",
        courseCode: "",
      })
    } catch (error) {
      console.error("Error adding event:", error)
      toast({
        title: "Error",
        description: "There was a problem adding your event. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading calendar...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>Create a new event in your calendar.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={newEvent.title}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newEvent.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={newEvent.date}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startTime" className="text-right">
                    Start Time
                  </Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={newEvent.startTime}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endTime" className="text-right">
                    End Time
                  </Label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={newEvent.endTime}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={newEvent.location}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Event Type
                  </Label>
                  <Select
                    value={newEvent.type}
                    onValueChange={(value) => setNewEvent((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lecture">Lecture</SelectItem>
                      <SelectItem value="office-hours">Office Hours</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="deadline">Deadline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="courseCode" className="text-right">
                    Course Code
                  </Label>
                  <Select
                    value={newEvent.courseCode}
                    onValueChange={(value) => setNewEvent((prev) => ({ ...prev, courseCode: value }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select course (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.code}>
                          {course.code} - {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleAddEvent}>
                  Add Event
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Schedule</CardTitle>
        </CardHeader>
        <CardContent>{viewMode === "week" ? renderWeekView() : renderMonthView()}</CardContent>
      </Card>

      {/* Summary of Courses */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>My Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(course => (
              <div key={course.id} className="border rounded-md p-4">
                <div className="flex justify-between">
                  <h3 className="font-bold">{course.code}</h3>
                  <Badge>{course.schedules?.length || 0} sessions</Badge>
                </div>
                <p className="text-sm mt-1">{course.name}</p>
                <div className="mt-3 space-y-2">
                  {course.schedules?.map((schedule, idx) => (
                    <div key={idx} className="text-sm bg-gray-50 p-2 rounded flex items-center gap-2">
                      <div className="text-xs">{schedule.day}</div>
                      <div className="text-xs ml-auto">
                        {schedule.startTime.substring(0, 5)} - {schedule.endTime.substring(0, 5)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {schedule.room}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}