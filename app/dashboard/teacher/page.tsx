"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Users, Clock, Calendar, Loader2 } from "lucide-react"
import { api, tokenUtils } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function TeacherDashboard() {
  const [teacherData, setTeacherData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchTeacherData = async () => {
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

        // Fetch teacher's courses
        const response = await api.protected.fetchWithAuth(`/courses/teacher/${userData.id}`)
        console.log("Teacher courses response:", response)
        
        if (response.success && response.data) {
          const courses = response.data
          
          // Calculate the next class for each course
          const coursesWithNextClass = courses.map(course => {
            const schedule = getNextSchedule(course.schedules)
            const studentCount = generateStudentCount(course.code)
            
            return {
              id: course.id,
              name: course.name,
              code: course.code,
              description: course.description,
              students: studentCount,
              nextClass: schedule.nextClass,
              room: schedule.room
            }
          })
          
          // Generate upcoming tasks and submissions based on the courses
          const upcomingTasks = generateUpcomingTasks(coursesWithNextClass)
          const recentSubmissions = generateRecentSubmissions(coursesWithNextClass)
          
          // Set the dashboard data
          console.log("course with next class",coursesWithNextClass);
          setTeacherData({
            name: userData.name || "Ashidu Dissanayake", // Use login name if provided
            courses: coursesWithNextClass,
            upcomingTasks,
            recentSubmissions
          })
        } else {
          toast({
            title: "Error fetching courses",
            description: "Could not retrieve your courses for the dashboard.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching teacher data:", error)
        toast({
          title: "Error",
          description: "Failed to load your dashboard. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeacherData()
  }, [toast])

  // Function to determine the next scheduled class
  const getNextSchedule = (schedules) => {
    if (!schedules || schedules.length === 0) {
      return { nextClass: "Not scheduled", room: "N/A" }
    }
    
    // Current date (May 17, 2025 is a Saturday)
    const currentDate = new Date("2025-05-17T10:08:42")
    const currentDay = currentDate.getDay() // 0 = Sunday, 6 = Saturday
    
    // Map day strings to day numbers
    const dayMap = {
      'SUNDAY': 0, 'MONDAY': 1, 'TUESDAY': 2, 'WEDNESDAY': 3,
      'THURSDAY': 4, 'FRIDAY': 5, 'SATURDAY': 6
    }
    
    // Find the next scheduled day
    let closestSchedule = schedules[0]
    let daysUntilNext = 7
    
    for (const schedule of schedules) {
      const scheduleDay = dayMap[schedule.day]
      if (scheduleDay === undefined) continue
      
      // Calculate days until this schedule day occurs
      let dayDiff = (scheduleDay - currentDay + 7) % 7
      if (dayDiff === 0) dayDiff = 7 // If today, it means next week
      
      if (dayDiff < daysUntilNext) {
        daysUntilNext = dayDiff
        closestSchedule = schedule
      }
    }
    
    // Format the next class time
    const nextDay = formatDay(closestSchedule.day)
    const startTime = formatTime(closestSchedule.startTime)
    
    return {
      nextClass: `${nextDay}, ${startTime}`,
      room: closestSchedule.room || "TBD"
    }
  }

  // Format day from "MONDAY" to "Monday"
  const formatDay = (day) => {
    if (!day) return "Monday"
    return day.charAt(0) + day.slice(1).toLowerCase()
  }
  
  // Format time from "10:00:00" to "10:00 AM"
  const formatTime = (time) => {
    if (!time) return "10:00 AM"
    const [hours, minutes] = time.split(":")
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }
  
  // Generate a consistent student count based on course code
  const generateStudentCount = (code) => {
    if (!code) return 25 // Default
    const seed = code.charCodeAt(0) + code.charCodeAt(code.length - 1)
    return 15 + (seed % 30) // Between 15-44 students
  }
  
  // Generate upcoming tasks based on real courses
  const generateUpcomingTasks = (courses) => {
    const tasks = []
    const currentDate = new Date("2025-05-17T10:08:42")
    
    courses.forEach((course, index) => {
      // We'll create 1-2 tasks per course
      const taskCount = 1 + (course.code.charCodeAt(0) % 2)
      
      for (let i = 0; i < taskCount && tasks.length < 4; i++) {
        const dayOffset = 3 + (index * 2) + (i * 5)
        const dueDate = new Date(currentDate)
        dueDate.setDate(currentDate.getDate() + dayOffset)
        
        tasks.push({
          id: tasks.length + 1,
          title: getTaskTitle(course.code, i),
          dueDate: `May ${dueDate.getDate()}, 2025`,
          course: `${course.code} - ${course.name}`
        })
      }
    })
    
    return tasks.slice(0, 4) // Limit to 4 tasks
  }

  // Generate task titles based on course code
  const getTaskTitle = (code, index) => {
    if (code.startsWith("CS")) {
      return index === 0 
        ? `Grade ${code} Programming Assignment` 
        : `Prepare ${code} Exam Questions`
    } else if (code.startsWith("MA")) {
      return index === 0 
        ? `Grade ${code} Problem Set` 
        : `Prepare ${code} Quiz`
    } else {
      return index === 0 
        ? `Grade ${code} Assignment` 
        : `Prepare ${code} Materials`
    }
  }
  
  // Generate recent submissions based on real courses
  const generateRecentSubmissions = (courses) => {
    return courses.slice(0, 3).map((course, index) => {
      const seed = course.code.charCodeAt(0) + index
      const submissions = course.students - (seed % 5)
      
      return {
        id: index + 1,
        title: getSubmissionTitle(course.code, index),
        course: `${course.code} - ${course.name}`,
        submissions: submissions,
        total: course.students
      }
    })
  }
  
  // Generate submission titles based on course code
  const getSubmissionTitle = (code, index) => {
    if (code.startsWith("CS")) {
      return index === 0 ? `${code} Programming Lab` : `${code} Midterm Report`
    } else if (code.startsWith("MA")) {
      return index === 0 ? `${code} Problem Set` : `${code} Quiz`
    } else {
      return index === 0 ? `${code} Assignment` : `${code} Project`
    }
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
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
        <p className="text-gray-500">Welcome back, {teacherData.name}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacherData.courses.length}</div>
            <p className="text-xs text-gray-500">Courses this semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teacherData.courses.reduce((acc, course) => acc + course.students, 0)}
            </div>
            <p className="text-xs text-gray-500">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacherData.upcomingTasks.length}</div>
            <p className="text-xs text-gray-500">Due in the next 2 weeks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Class</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-md font-bold">{teacherData.courses[0]?.nextClass || "No upcoming classes"}</div>
            <p className="text-xs text-gray-500">
              {teacherData.courses[0]?.name} - Room {teacherData.courses[0]?.room}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>My Courses</CardTitle>
            <CardDescription>Your active courses this semester</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teacherData.courses.map((course) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{course.name} ({course.code})</div>
                    <div className="text-sm text-gray-500">{course.students} students</div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 gap-1">
                    <div>Next class: {course.nextClass}</div>
                    <div>Room: {course.room}</div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href={`/dashboard/teacher/courses/${course.id}`}>View Course</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>Tasks that need your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teacherData.upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-gray-500">{task.course}</div>
                    </div>
                    <div className="text-sm font-medium">Due: {task.dueDate}</div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
              View All Tasks
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>Student submissions that need grading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teacherData.recentSubmissions.map((submission) => (
                  <div key={submission.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{submission.title}</div>
                      <div className="text-sm text-gray-500">{submission.course}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Submissions</span>
                        <span>
                          {submission.submissions}/{submission.total}
                        </span>
                      </div>
                      <Progress value={(submission.submissions / submission.total) * 100} className="h-2" />
                    </div>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      Grade Submissions
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}