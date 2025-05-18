"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, CalendarIcon, BookOpen, FileText, Loader2 } from "lucide-react"
import { api, tokenUtils } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

// Calendar data for 2025
const MONTHS = [
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

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

// Function to get days in month
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate()
}

// Function to get first day of month (0 = Sunday, 1 = Monday, etc.)
const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay()
}

export default function CalendarPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [events, setEvents] = useState([])
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()) // Current month
  const [currentYear] = useState(2025)
  const [selectedDate, setSelectedDate] = useState(new Date().getDate()) // Today's date
  const [selectedEvents, setSelectedEvents] = useState([])
  const [view, setView] = useState("month")
  const { toast } = useToast()

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Get the current user's ID from the token
        const userData = tokenUtils.getUserData()
        if (!userData || !userData.id) {
          toast({
            title: "Authentication error",
            description: "Please log in again to view your calendar.",
            variant: "destructive",
          })
          return
        }

        // Fetch the student's enrolled courses
        const response = await api.protected.fetchWithAuth(`/students/${userData.id}/courses`)
        console.log("Student courses response:", response)
        
        if (response.success && response.data && response.data.enrolledCourses) {
          const courses = response.data.enrolledCourses
          
          // Generate calendar events based on real course schedules
          const calendarEvents = []
          
          // Add class events based on real schedules
          courses.forEach(course => {
            if (course.schedules && course.schedules.length > 0) {
              // For each schedule, create recurring events for the whole month
              course.schedules.forEach(schedule => {
                // Get the day of week (0-6, where 0 is Sunday)
                const dayMap = {
                  "MONDAY": 1, "TUESDAY": 2, "WEDNESDAY": 3, 
                  "THURSDAY": 4, "FRIDAY": 5, "SATURDAY": 6, "SUNDAY": 0
                }
                const dayOfWeek = dayMap[schedule.day]
                
                // Get all dates in the current month that fall on this day of week
                const datesInMonth = []
                const daysInMonth = getDaysInMonth(currentYear, currentMonth)
                
                for (let day = 1; day <= daysInMonth; day++) {
                  const date = new Date(currentYear, currentMonth, day)
                  if (date.getDay() === dayOfWeek) {
                    datesInMonth.push(day)
                  }
                }
                
                // Create an event for each date
                datesInMonth.forEach(day => {
                  calendarEvents.push({
                    id: `class-${course.id}-${schedule.id}-${day}`,
                    title: `${course.code} Class`,
                    type: "class",
                    course: course.name,
                    date: `2025-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
                    time: `${formatTime(schedule.startTime)} - ${formatTime(schedule.endTime)}`,
                    location: schedule.room,
                  })
                })
              })
              
              // Generate mock assignments for each real course
              // We'll create 1-2 assignments per course that are due in the current month
              const assignmentsCount = 1 + (course.code.charCodeAt(0) % 2) // 1 or 2 assignments
              for (let i = 0; i < assignmentsCount; i++) {
                // Due date is between the 10th and 25th of the month
                const dueDay = 10 + ((course.code.charCodeAt(0) + i * 7) % 16)
                
                calendarEvents.push({
                  id: `assignment-${course.id}-${i}`,
                  title: `${course.code} ${getAssignmentTitle(course.code, i)}`,
                  type: "assignment",
                  course: course.name,
                  date: `2025-${String(currentMonth + 1).padStart(2, "0")}-${String(dueDay).padStart(2, "0")}`,
                  time: "11:59 PM",
                })
              }
              
              // Add a potential exam for the course (only some courses have exams)
              if ((course.id + currentMonth) % 3 === 0) { // One third of courses have exams in a given month
                // Exam date is usually in the last third of the month
                const examDay = 20 + (course.code.charCodeAt(0) % 8)
                
                calendarEvents.push({
                  id: `exam-${course.id}`,
                  title: `${course.code} ${getExamTitle(course.code)}`,
                  type: "exam",
                  course: course.name,
                  date: `2025-${String(currentMonth + 1).padStart(2, "0")}-${String(examDay).padStart(2, "0")}`,
                  time: "10:00 AM - 12:00 PM",
                  location: "Exam Hall 1",
                })
              }
            }
          })
          
          setEvents(calendarEvents)
        } else {
          toast({
            title: "Error fetching courses",
            description: "Could not retrieve your enrolled courses for the calendar.",
            variant: "destructive",
          })
          // Fallback to empty events array
          setEvents([])
        }
      } catch (error) {
        console.error("Error fetching student data:", error)
        toast({
          title: "Error",
          description: "Failed to load your calendar. Please try again later.",
          variant: "destructive",
        })
        // Fallback to empty events array
        setEvents([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudentData()
  }, [currentMonth, toast]) // Re-fetch when month changes

  // Format time from HH:MM:SS to HH:MM AM/PM
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    let hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // Convert to 12-hour format
    return `${hour}:${minutes} ${ampm}`;
  };

  // Generate realistic assignment titles based on course code
  const getAssignmentTitle = (code, index) => {
    if (code.startsWith("CS")) {
      return index === 0 ? "Problem Set" : "Programming Project";
    } else if (code.startsWith("PHY")) {
      return index === 0 ? "Lab Report" : "Problem Set";
    } else if (code.startsWith("ENG")) {
      return index === 0 ? "Essay" : "Reading Response";
    } else {
      return index === 0 ? "Assignment 1" : "Assignment 2";
    }
  };

  // Generate exam titles based on course code
  const getExamTitle = (code) => {
    if (currentMonth < 4) { // Jan-Apr
      return "Midterm Exam";
    } else if (currentMonth > 8) { // Sep-Dec
      return "Final Exam";
    } else {
      return "Exam"; // General exam for other months
    }
  };

  useEffect(() => {
    if (selectedDate) {
      const dateStr = `2025-${String(currentMonth + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`
      const filteredEvents = events.filter((event) => event.date === dateStr)
      setSelectedEvents(filteredEvents)
    } else {
      setSelectedEvents([])
    }
  }, [selectedDate, currentMonth, events])

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1))
    setSelectedDate(null)
  }

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1))
    setSelectedDate(null)
  }

  const handleDateClick = (day) => {
    setSelectedDate(day)
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth)
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 p-1" />)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `2025-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      const dayEvents = events.filter((event) => event.date === dateStr)
      const hasEvents = dayEvents.length > 0
      const isSelected = day === selectedDate
      
      // Count events by type for this day
      const classCount = dayEvents.filter(e => e.type === "class").length
      const assignmentCount = dayEvents.filter(e => e.type === "assignment").length
      const examCount = dayEvents.filter(e => e.type === "exam").length

      days.push(
        <div
          key={day}
          className={`h-24 border p-1 transition-colors hover:bg-gray-50 ${
            isSelected ? "bg-blue-50 ring-2 ring-blue-500" : ""
          }`}
          onClick={() => handleDateClick(day)}
        >
          <div className="flex h-full flex-col">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-sm ${
                isSelected ? "bg-blue-500 text-white" : ""
              }`}
            >
              {day}
            </div>
            {hasEvents && (
              <div className="mt-1 flex flex-wrap gap-1">
                {classCount > 0 && (
                  <Badge variant="outline" className="border-blue-200 bg-blue-50 text-xs">
                    {classCount} {classCount === 1 ? "Class" : "Classes"}
                  </Badge>
                )}
                {assignmentCount > 0 && (
                  <Badge variant="outline" className="border-amber-200 bg-amber-50 text-xs">
                    {assignmentCount} {assignmentCount === 1 ? "Assignment" : "Assignments"}
                  </Badge>
                )}
                {examCount > 0 && (
                  <Badge variant="outline" className="border-red-200 bg-red-50 text-xs">
                    {examCount} {examCount === 1 ? "Exam" : "Exams"}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>,
      )
    }

    return days
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading calendar...</span>
      </div>
    )
  }

  const today = new Date()
  const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear()
  const currentDate = today.getDate()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Academic Calendar</h1>
        <div className="flex items-center space-x-2">
          <Select value={view} onValueChange={setView}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month View</SelectItem>
              <SelectItem value="week">Week View</SelectItem>
              <SelectItem value="agenda">Agenda View</SelectItem>
            </SelectContent>
          </Select>
          {isCurrentMonth && (
            <Button variant="outline" onClick={() => handleDateClick(currentDate)}>
              Today
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-gray-500" />
              <CardTitle>
                {MONTHS[currentMonth]} {currentYear}
              </CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>View your classes, assignments, and exams</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {DAYS.map((day) => (
              <div key={day} className="p-1 text-center text-sm font-medium">
                {day}
              </div>
            ))}
            {renderCalendar()}
          </div>
        </CardContent>
      </Card>

      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>
              Events for {MONTHS[currentMonth]} {selectedDate}, {currentYear}
            </CardTitle>
            <CardDescription>
              {selectedEvents.length === 0
                ? "No events scheduled for this day"
                : `${selectedEvents.length} event${selectedEvents.length !== 1 ? "s" : ""} scheduled`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedEvents.map((event) => (
                <div key={event.id} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center">
                      {event.type === "class" ? (
                        <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
                      ) : event.type === "assignment" ? (
                        <FileText className="mr-2 h-5 w-5 text-amber-500" />
                      ) : (
                        <CalendarIcon className="mr-2 h-5 w-5 text-red-500" />
                      )}
                      <h3 className="font-semibold">{event.title}</h3>
                    </div>
                    <Badge
                      variant={
                        event.type === "class" ? "default" : event.type === "assignment" ? "secondary" : "destructive"
                      }
                    >
                      {event.type === "class" ? "Class" : event.type === "assignment" ? "Assignment" : "Exam"}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-500">
                    <p>Course: {event.course}</p>
                    <p>Time: {event.time}</p>
                    {event.location && <p>Location: {event.location}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Assignments</CardTitle>
            <CardDescription>Assignments due in the next 2 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events
                .filter(
                  (event) =>
                    event.type === "assignment" &&
                    new Date(event.date) > new Date() &&
                    new Date(event.date) < new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
                )
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((event) => (
                  <div key={event.id} className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-gray-500">{event.course}</div>
                    </div>
                    <div className="text-sm font-medium">
                      Due: {new Date(event.date).toLocaleDateString()} {event.time}
                    </div>
                  </div>
                ))}
              {events.filter(
                (event) =>
                  event.type === "assignment" &&
                  new Date(event.date) > new Date() &&
                  new Date(event.date) < new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
              ).length === 0 && (
                <div className="text-center text-gray-500">No assignments due in the next 2 weeks</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Exams</CardTitle>
            <CardDescription>Exams scheduled for this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events
                .filter(
                  (event) =>
                    event.type === "exam" &&
                    new Date(event.date) > new Date(`2025-${String(currentMonth + 1).padStart(2, "0")}-01`) &&
                    new Date(event.date) <
                      new Date(
                        `2025-${String(currentMonth + 1).padStart(2, "0")}-${getDaysInMonth(currentYear, currentMonth)}`,
                      ),
                )
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((event) => (
                  <div key={event.id} className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-gray-500">{event.course}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{new Date(event.date).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">{event.time}</div>
                    </div>
                  </div>
                ))}
              {events.filter(event => event.type === "exam").length === 0 && (
                <div className="text-center text-gray-500">No exams scheduled for this month</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}