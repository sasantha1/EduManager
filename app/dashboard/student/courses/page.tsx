"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Users, Calendar, FileText, ExternalLink, Loader2 } from "lucide-react"
import { api, tokenUtils } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function StudentCoursesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [courses, setCourses] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchStudentCourses = async () => {
      try {
        // Get the current user's ID from the token
        const userData = tokenUtils.getUserData()
        if (!userData || !userData.id) {
          toast({
            title: "Authentication error",
            description: "Please log in again.",
            variant: "destructive",
          })
          return
        }

        // Fetch the student's enrolled courses
        const response = await api.protected.fetchWithAuth(`/students/${userData.id}/courses`)
        console.log("Student courses response:", response)
        
        if (response.success && response.data && response.data.enrolledCourses) {
          // Map over the real enrolled courses and add mock data for each
          const enrichedCourses = response.data.enrolledCourses.map(course => {
            // Format schedules properly
            const schedules = course.schedules && course.schedules.length > 0 
              ? course.schedules.map(s => ({
                  day: formatDay(s.day),
                  time: `${formatTime(s.startTime)} - ${formatTime(s.endTime)}`,
                  room: s.room
                }))
              : getMockSchedule(course.code)
              
            // Map the real course data we have
            return {
              id: course.id,
              code: course.code,
              name: course.name,
              instructor: course.teacher?.name || "Not assigned",
              department: course.teacher?.department || "Unknown",
              description: course.description,
              createdAt: course.createdAt,
              updatedAt: course.updatedAt,
              teacherId: course.teacherId,
              
              // Add hardcoded data that our API doesn't provide
              progress: getProgressForCourse(course.code),
              nextClass: getNextClassFromSchedule(schedules),
              room: schedules[0]?.room || getRoomForCourse(course.code),
              
              // Mock assignments based on course code
              assignments: getMockAssignments(course.code),
              
              // Mock materials
              materials: getMockMaterials(course.code),
              
              // Use formatted schedules
              schedule: schedules
            }
          })
          
          setCourses(enrichedCourses)
        } else {
          toast({
            title: "Error fetching courses",
            description: "Could not retrieve your enrolled courses.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching student courses:", error)
        toast({
          title: "Error",
          description: "Failed to load your courses. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudentCourses()
  }, [toast])

  // Format time from "HH:MM:SS" to "H:MM AM/PM"
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    let hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // Convert to 12-hour format
    return `${hour}:${minutes} ${ampm}`;
  };

  // Format day from "MONDAY" to "Monday"
  const formatDay = (day) => {
    if (!day) return "";
    return day.charAt(0) + day.slice(1).toLowerCase();
  };

  // Get next class from schedule array
  const getNextClassFromSchedule = (schedule) => {
    if (!schedule || schedule.length === 0) return "No scheduled classes";
    
    // Just return the first scheduled class for simplicity
    return `${schedule[0].day}, ${schedule[0].time.split(" - ")[0]}`;
  };

  // Generate a consistent progress value based on course code
  const getProgressForCourse = (code) => {
    const seed = code.charCodeAt(0) + code.charCodeAt(code.length - 1);
    return Math.floor(60 + (seed % 40)); // 60-99%
  };

  const getRoomForCourse = (code) => {
    const buildings = ["A", "B", "C"];
    const seed = code.charCodeAt(0) + code.charCodeAt(code.length - 1);
    const building = buildings[seed % buildings.length];
    const roomNumber = 100 + (seed % 10) * 10 + (seed % 5);
    
    return `${building}-${roomNumber}`;
  };

  const getMockAssignments = (code) => {
    if (code === "CS101") {
      return [
        {
          id: 1,
          title: "Problem Set 5",
          dueDate: "May 15, 2025",
          status: "pending",
          grade: null,
        },
        {
          id: 2,
          title: "Problem Set 4",
          dueDate: "May 1, 2025",
          status: "submitted",
          grade: null,
        },
        {
          id: 3,
          title: "Problem Set 3",
          dueDate: "April 15, 2025",
          status: "graded",
          grade: "A",
        },
      ];
    } else {
      // Default assignments for other courses
      return [
        {
          id: 1,
          title: `${code} Assignment 1`,
          dueDate: "May 20, 2025",
          status: "pending",
          grade: null,
        },
        {
          id: 2,
          title: `${code} Assignment 2`,
          dueDate: "April 25, 2025",
          status: "graded",
          grade: "B+",
        },
      ];
    }
  };

  const getMockMaterials = (code) => {
    if (code === "CS101") {
      return [
        { id: 1, title: "Course Syllabus", type: "pdf" },
        { id: 2, title: "Week 10 Lecture Notes", type: "pdf" },
        { id: 3, title: "Java Programming Examples", type: "zip" },
      ];
    } else {
      // Default materials for other courses
      return [
        { id: 1, title: `${code} Course Syllabus`, type: "pdf" },
        { id: 2, title: `${code} Lecture Notes`, type: "pdf" },
        { id: 3, title: `${code} Additional Resources`, type: "pdf" },
      ];
    }
  };

  const getMockSchedule = (code) => {
    if (code === "CS101") {
      return [
        { day: "Monday", time: "10:00 AM - 12:00 PM", room: "A-201" },
        { day: "Wednesday", time: "11:00 AM - 1:00 PM", room: "A-201" },
      ];
    } else {
      // Deterministic "random" based on course code
      const seed = code.charCodeAt(0) + code.charCodeAt(code.length - 1);
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      const day1 = days[seed % days.length];
      const day2 = days[(seed + 2) % days.length];
      const room = getRoomForCourse(code);
      
      return [
        { day: day1, time: "9:00 AM - 11:00 AM", room },
        { day: day2, time: "1:00 PM - 3:00 PM", room },
      ];
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading courses...</span>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Courses</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>No Courses Found</CardTitle>
            <CardDescription>
              You are not enrolled in any courses yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              Please contact your administrator or check back later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Courses</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <div className="h-2 bg-primary" style={{ width: `${course.progress}%` }} />
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{course.name}</CardTitle>
                  <CardDescription>{course.code}</CardDescription>
                </div>
                <Badge variant="outline">{course.progress}%</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Users className="mr-2 h-4 w-4 text-gray-500" />
                  <span>Instructor: {course.instructor}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                  <span>Next class: {course.nextClass}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4 text-gray-500" />
                  <span>Room: {course.room}</span>
                </div>
              </div>
              <Link href={`/dashboard/student/courses/${course.id}`}>
                <Button className="w-full">
                  View Course Details
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
          <CardDescription>Detailed information about your selected course</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={courses.length > 0 ? courses[0].code.toLowerCase() : "empty"}>
            <TabsList className="mb-4 w-full justify-start overflow-auto">
              {courses.map((course) => (
                <TabsTrigger key={course.id} value={course.code.toLowerCase()}>
                  {course.code}
                </TabsTrigger>
              ))}
            </TabsList>

            {courses.map((course) => (
              <TabsContent key={course.id} value={course.code.toLowerCase()} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">{course.name}</h3>
                    <p className="text-gray-500">
                      {course.code} • Instructor: {course.instructor}
                    </p>
                  </div>

                  <div>
                    <h4 className="mb-2 font-semibold">Course Description</h4>
                    <p className="text-gray-600">{course.description}</p>
                  </div>

                  <div>
                    <h4 className="mb-2 font-semibold">Progress</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Course Completion</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 font-semibold">Schedule</h4>
                    <div className="space-y-2">
                      {course.schedule.map((session, index) => (
                        <div key={index} className="flex items-center justify-between rounded-md border p-2">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                            <span>{session.day}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {session.time} • {session.room}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 font-semibold">Assignments</h4>
                    <div className="space-y-2">
                      {course.assignments.map((assignment) => (
                        <div key={assignment.id} className="rounded-md border p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText className="mr-2 h-4 w-4 text-gray-500" />
                              <span className="font-medium">{assignment.title}</span>
                            </div>
                            <Badge
                              variant={
                                assignment.status === "graded"
                                  ? "success"
                                  : assignment.status === "submitted"
                                    ? "outline"
                                    : "secondary"
                              }
                            >
                              {assignment.status === "graded"
                                ? `Graded: ${assignment.grade}`
                                : assignment.status === "submitted"
                                  ? "Submitted"
                                  : "Pending"}
                            </Badge>
                          </div>
                          <div className="mt-1 text-sm text-gray-500">Due: {assignment.dueDate}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 font-semibold">Course Materials</h4>
                    <div className="space-y-2">
                      {course.materials.map((material) => (
                        <div key={material.id} className="flex items-center justify-between rounded-md border p-2">
                          <div className="flex items-center">
                            <BookOpen className="mr-2 h-4 w-4 text-gray-500" />
                            <span>{material.title}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}