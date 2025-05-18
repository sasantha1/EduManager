"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Award, Calendar, FileText, Users, MapPin, Loader2 } from "lucide-react"
import { api, tokenUtils } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Get the current user's ID from the token
        const userData = tokenUtils.getUserData()
        if (!userData || !userData.id) {
          toast({
            title: "Authentication error",
            description: "Please log in again to view your dashboard.",
            variant: "destructive",
          })
          return
        }

        // Fetch student profile
        const profileResponse = await api.protected.fetchWithAuth(`/students/${userData.id}`)
        
        if (!profileResponse.success || !profileResponse.data) {
          throw new Error("Failed to fetch student profile")
        }
        
        const profileData = profileResponse.data
        
        // Fetch enrolled courses
        const coursesResponse = await api.protected.fetchWithAuth(`/students/${userData.id}/courses`)
        
        if (!coursesResponse.success || !coursesResponse.data) {
          throw new Error("Failed to fetch enrolled courses")
        }
        
        const enrolledCourses = coursesResponse.data.enrolledCourses || []

        // Enhance course data with additional details
        const enhancedCourses = enrolledCourses.map(course => {
          // Generate a deterministic progress value based on course code
          const progress = getProgressForCourse(course.code)
          
          // Get the next class from schedule if available, otherwise generate mock
          const nextClass = getNextClassInfo(course.schedules || [], course.code)
          
          // Generate recent activity based on course code
          const recentActivity = generateRecentActivity(course.code)
          
          return {
            id: course.id,
            code: course.code,
            name: course.name,
            description: course.description,
            progress: progress,
            nextClass: nextClass.day + ", " + nextClass.time,
            room: nextClass.room,
            instructor: course.teacher ? course.teacher.name : "Not assigned",
            recentActivity: recentActivity,
          }
        })
        
        // Build complete student dashboard data
        const dashboardData = {
          name: profileData.name,
          studentId: profileData.studentId,
          program: profileData.program,
          year: profileData.year,
          courses: enhancedCourses,
          upcomingAssignments: generateUpcomingAssignments(enhancedCourses),
          announcements: generateAnnouncements(enhancedCourses),
          recentGrades: generateRecentGrades(enhancedCourses),
          upcomingEvents: generateUpcomingEvents(enhancedCourses),
        }
        
        setStudentData(dashboardData)
      } catch (error) {
        console.error("Error fetching student data:", error)
        toast({
          title: "Error",
          description: "Failed to load your dashboard. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudentData()
  }, [toast])

  // Function to generate a deterministic progress value based on course code
  const getProgressForCourse = (code) => {
    const seed = code.charCodeAt(0) + code.charCodeAt(code.length - 1)
    return 60 + (seed % 40) // Between 60-99%
  }

  // Function to format the day name from API data (MONDAY -> Monday)
  const formatDay = (day) => {
    if (!day) return "Monday"
    return day.charAt(0) + day.slice(1).toLowerCase()
  }
  
  // Function to format time from API (10:00:00 -> 10:00 AM)
  const formatTime = (time) => {
    if (!time) return "10:00 AM"
    const [hours, minutes] = time.split(":")
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }
  
  // Function to get next class information from schedules
  const getNextClassInfo = (schedules, code) => {
    if (!schedules || schedules.length === 0) {
      // Generate mock schedule based on course code
      const seed = code.charCodeAt(0) + code.charCodeAt(code.length - 1)
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
      const times = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"]
      const buildings = ["A", "B", "C"]
      
      const day = days[seed % 5]
      const time = times[(seed + 2) % 6]
      const building = buildings[seed % 3]
      const roomNumber = 100 + (seed % 20)
      
      return {
        day,
        time,
        room: `${building}-${roomNumber}`
      }
    }
    
    // Use the first schedule from the API
    const firstSchedule = schedules[0]
    return {
      day: formatDay(firstSchedule.day),
      time: formatTime(firstSchedule.startTime),
      room: firstSchedule.room || "Not specified"
    }
  }

  // Function to generate recent activity for a course
  const generateRecentActivity = (code) => {
    const seed = code.charCodeAt(0) + code.charCodeAt(code.length - 1)
    const now = new Date()
    
    // Generate different activities based on course code
    if (code.startsWith("CS")) {
      return [
        { 
          type: "material", 
          title: "Variables and Data Types", 
          date: `${2 + (seed % 3)} days ago` 
        },
        {
          type: "assignment",
          title: "Programming Assignment 1",
          date: `${1 + (seed % 2)} week ago`,
          status: seed % 3 === 0 ? "completed" : "pending",
          grade: seed % 3 === 0 ? ["A", "A-", "B+"][seed % 3] : null,
        },
      ]
    } else if (code.startsWith("PHY")) {
      return [
        {
          type: "assignment",
          title: "Lab Report",
          date: `${3 + (seed % 4)} days ago`,
          status: seed % 4 === 0 ? "completed" : "pending",
          grade: seed % 4 === 0 ? ["A", "B+", "B"][seed % 3] : null,
        },
        { 
          type: "material", 
          title: "Physics Principles", 
          date: `${1 + (seed % 2)} week ago` 
        },
      ]
    } else {
      return [
        { 
          type: "material", 
          title: `Course Materials for ${code}`, 
          date: `${2 + (seed % 5)} days ago` 
        },
        {
          type: "assignment",
          title: `${code} Assignment`,
          date: `${1 + (seed % 3)} week ago`,
          status: seed % 2 === 0 ? "completed" : "pending",
          grade: seed % 2 === 0 ? ["A", "B+", "A-", "B"][seed % 4] : null,
        },
      ]
    }
  }

  // Function to generate upcoming assignments
  const generateUpcomingAssignments = (courses) => {
    const assignments = []
    const currentDate = new Date("2025-05-17")
    
    courses.forEach(course => {
      // Generate 1-2 assignments per course
      const count = 1 + (course.code.charCodeAt(0) % 2)
      
      for (let i = 0; i < count; i++) {
        const seed = course.code.charCodeAt(0) + i
        const daysToAdd = 3 + (seed % 12) // Due in 3-15 days
        
        const dueDate = new Date(currentDate)
        dueDate.setDate(currentDate.getDate() + daysToAdd)
        
        assignments.push({
          id: assignments.length + 1,
          courseId: course.id,
          title: getAssignmentTitle(course.code, i),
          dueDate: `May ${dueDate.getDate()}, 2025`,
          course: `${course.code} - ${course.name}`,
        })
      }
    })
    
    // Sort by due date (approximating by assignment ID for simplicity)
    return assignments.sort((a, b) => {
      const dateA = new Date(a.dueDate)
      const dateB = new Date(b.dueDate)
      return dateA - dateB
    })
  }
  
  // Function to generate assignment titles
  const getAssignmentTitle = (code, index) => {
    if (code.startsWith("CS")) {
      return index === 0 ? "Problem Set" : "Programming Project"
    } else if (code.startsWith("PHY")) {
      return index === 0 ? "Lab Report" : "Problem Set"
    } else if (code.startsWith("ENG")) {
      return index === 0 ? "Essay" : "Reading Response"
    } else {
      return index === 0 ? "Assignment 1" : "Assignment 2"
    }
  }

  // Function to generate announcements
  const generateAnnouncements = (courses) => {
    // Common announcements
    const announcements = [
      { 
        id: 1, 
        title: "End of Semester Exam Schedule", 
        date: "May 5, 2025", 
        course: "University-wide" 
      },
      { 
        id: 2, 
        title: "Campus Closure for Holiday", 
        date: "May 8, 2025", 
        course: "University-wide" 
      },
    ]
    
    // Course-specific announcements
    courses.forEach((course, index) => {
      const seed = course.code.charCodeAt(0)
      
      if (index < 3) { // Limit to 3 course-specific announcements
        announcements.push({
          id: announcements.length + 1,
          title: getCourseAnnouncement(course.code),
          date: `May ${1 + (seed % 10)}, 2025`,
          course: `${course.code} - ${course.name}`,
        })
      }
    })
    
    return announcements
  }
  
  // Function to generate course announcements
  const getCourseAnnouncement = (code) => {
    if (code.startsWith("CS")) {
      return "Midterm Exam Details"
    } else if (code.startsWith("PHY")) {
      return "Lab Session Changes"
    } else if (code.startsWith("ENG")) {
      return "Guest Speaker Announcement"
    } else {
      return "Important Course Update"
    }
  }

  // Function to generate recent grades
  const generateRecentGrades = (courses) => {
    const grades = []
    
    courses.forEach(course => {
      if (grades.length < 3) { // Limit to 3 grades total
        const seed = course.code.charCodeAt(0)
        
        if (seed % 3 === 0 || grades.length === 0) { // Ensure at least one grade per student
          grades.push({
            id: grades.length + 1,
            courseId: course.id,
            title: getGradeTitle(course.code),
            grade: getGrade(seed),
            maxGrade: getMaxGrade(seed),
            date: `April ${15 + (seed % 15)}, 2025`,
            course: course.code,
          })
        }
      }
    })
    
    return grades
  }
  
  // Function to generate grade titles
  const getGradeTitle = (code) => {
    if (code.startsWith("CS")) {
      return "Quiz: Programming Basics"
    } else if (code.startsWith("PHY")) {
      return "Lab Report"
    } else if (code.startsWith("ENG")) {
      return "Essay Assignment"
    } else {
      return "Course Assessment"
    }
  }
  
  // Function to generate grades
  const getGrade = (seed) => {
    const letterGrades = ["A", "A-", "B+", "B", "B-"]
    const percentGrades = ["90%", "85%", "92%", "88%", "95%"]
    
    return seed % 2 === 0 ? letterGrades[seed % 5] : percentGrades[seed % 5]
  }
  
  // Function to get max grade
  const getMaxGrade = (seed) => {
    return seed % 2 === 0 ? "A" : "100%"
  }

  // Function to generate upcoming events
  const generateUpcomingEvents = (courses) => {
    const events = []
    const currentDate = new Date("2025-05-17")
    
    // Midterm exam for the first course
    if (courses.length > 0) {
      const course = courses[0]
      const seed = course.code.charCodeAt(0)
      const daysToAdd = 3 + (seed % 7) // Exam in 3-10 days
      
      const examDate = new Date(currentDate)
      examDate.setDate(currentDate.getDate() + daysToAdd)
      
      events.push({
        id: 1,
        title: `Midterm Exam: ${course.code}`,
        date: `May ${examDate.getDate()}, 2025`,
        time: "10:00 AM - 12:00 PM",
        location: "Exam Hall 1",
      })
    }
    
    // Study group event
    if (courses.length > 1) {
      const course = courses[1]
      const seed = course.code.charCodeAt(0)
      const daysToAdd = 1 + (seed % 5) // Study group in 1-6 days
      
      const studyDate = new Date(currentDate)
      studyDate.setDate(currentDate.getDate() + daysToAdd)
      
      events.push({
        id: 2,
        title: `Study Group: ${course.name.split(" ")[course.name.split(" ").length - 1]}`,
        date: `May ${studyDate.getDate()}, 2025`,
        time: "3:00 PM - 5:00 PM",
        location: "Library Study Room 3",
      })
    }
    
    // Academic advising session
    const advisingDate = new Date(currentDate)
    advisingDate.setDate(currentDate.getDate() + 10)
    
    events.push({
      id: 3,
      title: "Academic Advising Session",
      date: `May ${advisingDate.getDate()}, 2025`,
      time: "1:00 PM - 2:00 PM",
      location: "Admin Building, Room 105",
    })
    
    return events
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading dashboard...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <p className="text-gray-500">Welcome back, {studentData.name}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentData.courses.length}</div>
            <p className="text-xs text-gray-500">Active courses this semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Assignments</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentData.upcomingAssignments.length}</div>
            <p className="text-xs text-gray-500">Due in the next 2 weeks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <Award className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                studentData.courses.reduce((acc, course) => acc + course.progress, 0) / studentData.courses.length,
              )}
              %
            </div>
            <p className="text-xs text-gray-500">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Class</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-md font-bold">{studentData.courses[0]?.nextClass || "No upcoming classes"}</div>
            <p className="text-xs text-gray-500">{studentData.courses[0]?.name || ""}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
              <CardDescription>Your enrolled courses and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {studentData.courses.map((course) => (
                  <div key={course.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Link href={`/dashboard/student/courses/${course.id}`} className="hover:underline">
                        <div className="font-medium">{course.name}</div>
                      </Link>
                      <div className="text-sm text-gray-500">{course.progress}%</div>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        <span>Next class: {course.nextClass}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>Room: {course.room}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-1 h-3 w-3" />
                        <span>Instructor: {course.instructor}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs font-medium text-gray-500">Recent Activity</div>
                      <div className="mt-1 space-y-1">
                        {course.recentActivity.map((activity, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded-md bg-gray-50 px-2 py-1"
                          >
                            <div className="flex items-center">
                              {activity.type === "material" ? (
                                <BookOpen className="mr-1 h-3 w-3 text-blue-500" />
                              ) : (
                                <FileText className="mr-1 h-3 w-3 text-amber-500" />
                              )}
                              <span className="text-xs">{activity.title}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {activity.status && (
                                <Badge
                                  variant={activity.status === "completed" ? "success" : "outline"}
                                  className="text-xs"
                                >
                                  {activity.status === "completed"
                                    ? activity.grade
                                      ? `Graded: ${activity.grade}`
                                      : "Completed"
                                    : "Pending"}
                                </Badge>
                              )}
                              <span className="text-xs text-gray-500">{activity.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/student/courses/${course.id}`}>View Course</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Assignments</CardTitle>
                <CardDescription>Assignments due soon</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentData.upcomingAssignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <Link
                          href={`/dashboard/student/courses/${assignment.courseId}/assignments/${assignment.id}`}
                          className="font-medium hover:underline"
                        >
                          {assignment.title}
                        </Link>
                        <div className="text-sm text-gray-500">{assignment.course}</div>
                      </div>
                      <div className="text-sm font-medium">Due: {assignment.dueDate}</div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/student/assignments">View All Assignments</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Grades</CardTitle>
                <CardDescription>Your latest graded work</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentData.recentGrades.length > 0 ? (
                    studentData.recentGrades.map((grade) => (
                      <div key={grade.id} className="flex items-center justify-between rounded-md border p-3">
                        <div>
                          <div className="font-medium">{grade.title}</div>
                          <div className="text-sm text-gray-500">{grade.course}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {grade.grade} <span className="text-xs text-gray-500">/ {grade.maxGrade}</span>
                          </div>
                          <div className="text-xs text-gray-500">{grade.date}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">No recent grades available</div>
                  )}
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/student/grades">View All Grades</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Announcements</CardTitle>
              <CardDescription>Latest updates from your institution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentData.announcements.map((announcement) => (
                  <div key={announcement.id} className="border-b pb-3 last:border-0 last:pb-0">
                    <div className="font-medium">{announcement.title}</div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{announcement.course}</span>
                      <span>{announcement.date}</span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Announcements
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Events on your academic calendar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentData.upcomingEvents.map((event) => (
                  <div key={event.id} className="rounded-md border p-3">
                    <div className="font-medium">{event.title}</div>
                    <div className="mt-1 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-3 w-3" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/student/calendar">View Calendar</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}