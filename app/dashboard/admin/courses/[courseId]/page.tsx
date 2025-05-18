"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  BookOpen,
  FileText,
  Video,
  Users,
  Calendar,
  Clock,
  Download,
  ExternalLink,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  Edit,
  Trash2,
} from "lucide-react"
import { api, tokenUtils } from "@/lib/api" // Import API utilities
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId
  const [isLoading, setIsLoading] = useState(true)
  const [course, setCourse] = useState(null)
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editFormData, setEditFormData] = useState({
    name: "",
    code: "",
    description: "",
    teacherId: "",
    schedules: []
  })

  const fetchCourseDetails = async () => {
    try {
      const courseResponse = await api.protected.fetchWithAuth(`/courses/${courseId}`)
      console.log("Course response:", courseResponse)
      if (courseResponse.success && courseResponse.data) {
        const realCourse = courseResponse.data
        
        // First fetch the teacher details
        const teacherResponse = await api.protected.fetchWithAuth(`/teachers/teacherId/${realCourse.teacherId}`)
        const teacherData = teacherResponse.success ? teacherResponse.data : null
        
        // Combine real data with mock data
        setCourse({
          id: realCourse.id,
          code: realCourse.code,
          name: realCourse.name,
          // Update instructor handling
          instructor: teacherData ? teacherData.name : "Not assigned",
          teacherId: realCourse.teacherId || "",
          department: teacherData ? teacherData.department : "Not assigned",
          
          progress: 75,
          description: realCourse.description,
          announcements: generateAnnouncements(realCourse.code),
          modules: generateModules(realCourse.code),
          assignments: generateAssignments(realCourse.code),
          resources: generateResources(realCourse.code),
          schedule: realCourse.schedules && realCourse.schedules.length > 0 
            ? realCourse.schedules.map(s => ({
                day: s.day,
                time: `${s.startTime} - ${s.endTime}`,
                room: s.room
              }))
            : generateSchedule(realCourse.code),
          forum: generateForum(realCourse.code),
        })
      } else {
        toast({
          title: "Error fetching course",
          description: courseResponse.message || "Could not retrieve course details",
          variant: "destructive",
        })
        router.push("/dashboard/admin/courses")
      }
    } catch (error) {
      console.error("Error fetching course details:", error)
      toast({
        title: "Error",
        description: "Failed to load course details. Please try again later.",
        variant: "destructive",
      })
      router.push("/dashboard/admin/courses")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCourseDetails()
  }, [courseId, router, toast])

  // Helper functions to generate consistent mock data based on course code
  const generateAnnouncements = (code) => {
    const baseAnnouncements = [
      {
        id: 1,
        title: "Midterm Exam Schedule",
        content: "The midterm exam will be held on May 12, 2025, from 10:00 AM to 12:00 PM in Exam Hall 1.",
        date: "May 5, 2025",
      },
      {
        id: 2,
        title: "Assignment 3 Deadline Extended",
        content: "Due to the upcoming holiday, the deadline for Assignment 3 has been extended to May 18, 2025.",
        date: "May 3, 2025",
      }
    ]
    
    // Add course-specific announcement
    if (code === "CS101") {
      baseAnnouncements.push({
        id: 3,
        title: "Java Coding Competition",
        content: "Register by May 20th for the upcoming Java coding competition. Prizes for top performers!",
        date: "May 10, 2025",
      })
    } else if (code.startsWith("PHY")) {
      baseAnnouncements.push({
        id: 3,
        title: "Lab Equipment Update",
        content: "New laboratory equipment has arrived. Demonstration will be held next week.",
        date: "May 8, 2025",
      })
    } else if (code.startsWith("ENG")) {
      baseAnnouncements.push({
        id: 3,
        title: "Guest Speaker Announcement",
        content: "Award-winning author Sarah Johnson will be giving a talk on May 20th. Attendance is highly recommended.",
        date: "May 7, 2025",
      })
    }
    
    return baseAnnouncements
  }

  const generateModules = (code) => {
    if (code === "CS101") {
      return [
        {
          id: 1,
          title: "Module 1: Introduction to Java",
          description: "Basic concepts and environment setup",
          isActive: true,
          completed: true,
          content: [
            {
              id: 1,
              type: "lecture",
              title: "Introduction to Programming Concepts",
              description: "Overview of programming fundamentals",
              fileType: "pdf",
              fileUrl: "#",
              completed: true,
            },
            {
              id: 2,
              type: "video",
              title: "Setting Up Java Environment",
              description: "Step-by-step guide to install JDK and IDE",
              duration: "15 minutes",
              videoUrl: "#",
              completed: true,
            },
            {
              id: 3,
              type: "assignment",
              title: "Environment Setup Verification",
              description: "Submit screenshots of your working environment",
              dueDate: "April 10, 2025",
              status: "completed",
              grade: "A",
            },
          ],
        },
        {
          id: 2,
          title: "Module 2: Java Basics",
          description: "Variables, data types, and operators",
          isActive: true,
          completed: true,
          content: [
            {
              id: 4,
              type: "lecture",
              title: "Variables and Data Types",
              description: "Understanding different data types in Java",
              fileType: "pdf",
              fileUrl: "#",
              completed: true,
            },
            {
              id: 5,
              type: "video",
              title: "Working with Operators",
              description: "Arithmetic, relational, and logical operators",
              duration: "20 minutes",
              videoUrl: "#",
              completed: true,
            },
            {
              id: 6,
              type: "quiz",
              title: "Quiz: Java Basics",
              description: "Test your knowledge of variables and operators",
              timeLimit: "30 minutes",
              status: "completed",
              grade: "90%",
            },
          ],
        },
        {
          id: 3,
          title: "Module 3: Control Structures",
          description: "Conditional statements and loops",
          isActive: true,
          completed: false,
          content: [
            {
              id: 7,
              type: "lecture",
              title: "Conditional Statements",
              description: "If-else statements and switch cases",
              fileType: "pdf",
              fileUrl: "#",
              completed: true,
            },
            {
              id: 8,
              type: "video",
              title: "Loops in Java",
              description: "For, while, and do-while loops",
              duration: "25 minutes",
              videoUrl: "#",
              completed: false,
            },
            {
              id: 9,
              type: "assignment",
              title: "Control Structures Practice",
              description: "Implement various control structures in Java",
              dueDate: "May 15, 2025",
              status: "pending",
            },
          ],
        },
        {
          id: 4,
          title: "Module 4: Object-Oriented Programming",
          description: "Classes, objects, inheritance, and polymorphism",
          isActive: false,
          completed: false,
          content: [
            {
              id: 10,
              type: "lecture",
              title: "Classes and Objects",
              description: "Creating and using classes in Java",
              fileType: "pdf",
              fileUrl: "#",
              completed: false,
            },
            {
              id: 11,
              type: "video",
              title: "Inheritance and Polymorphism",
              description: "Advanced OOP concepts",
              duration: "30 minutes",
              videoUrl: "#",
              completed: false,
            },
            {
              id: 12,
              type: "assignment",
              title: "OOP Project",
              description: "Build a simple application using OOP principles",
              dueDate: "May 25, 2025",
              status: "not_started",
            },
          ],
        },
      ]
    } else if (code.startsWith("PHY")) {
      // Physics course modules (simplified)
      return [
        {
          id: 1,
          title: "Module 1: Mechanics",
          description: "Newton's laws and motion",
          isActive: true,
          completed: true,
          content: [
            {
              id: 1,
              type: "lecture",
              title: "Introduction to Classical Mechanics",
              description: "Basic principles of motion",
              fileType: "pdf",
              fileUrl: "#",
              completed: true,
            },
            {
              id: 2,
              type: "video",
              title: "Newton's Laws of Motion",
              description: "Understanding the three fundamental laws",
              duration: "22 minutes",
              videoUrl: "#",
              completed: true,
            },
          ],
        },
        {
          id: 2,
          title: "Module 2: Thermodynamics",
          description: "Heat, energy, and entropy",
          isActive: true,
          completed: false,
          content: [
            {
              id: 3,
              type: "lecture",
              title: "Introduction to Thermodynamics",
              description: "Basic concepts and laws",
              fileType: "pdf",
              fileUrl: "#",
              completed: true,
            },
            {
              id: 4,
              type: "video",
              title: "Thermal Equilibrium",
              description: "Understanding heat transfer and equilibrium",
              duration: "18 minutes",
              videoUrl: "#",
              completed: false,
            },
          ],
        },
      ]
    } else {
      // Default modules for other courses (simplified)
      return [
        {
          id: 1,
          title: `Module 1: Introduction to ${code}`,
          description: "Basic principles and concepts",
          isActive: true,
          completed: true,
          content: [
            {
              id: 1,
              type: "lecture",
              title: "Course Overview",
              description: "Introduction to key concepts",
              fileType: "pdf",
              fileUrl: "#",
              completed: true,
            },
            {
              id: 2,
              type: "video",
              title: "Getting Started",
              description: "First steps in the course",
              duration: "15 minutes",
              videoUrl: "#",
              completed: true,
            },
          ],
        },
        {
          id: 2,
          title: `Module 2: Core Concepts in ${code}`,
          description: "Fundamental knowledge areas",
          isActive: true,
          completed: false,
          content: [
            {
              id: 3,
              type: "lecture",
              title: "Key Principles",
              description: "Understanding the foundations",
              fileType: "pdf",
              fileUrl: "#",
              completed: true,
            },
            {
              id: 4,
              type: "assignment",
              title: "Concept Application",
              description: "Apply what you've learned to real scenarios",
              dueDate: "May 20, 2025",
              status: "pending",
            },
          ],
        },
      ]
    }
  }

  const generateAssignments = (code) => {
    if (code === "CS101") {
      return [
        {
          id: 1,
          title: "Environment Setup Verification",
          description: "Submit screenshots of your working environment",
          dueDate: "April 10, 2025",
          status: "completed",
          grade: "A",
          module: "Module 1: Introduction to Java",
        },
        {
          id: 2,
          title: "Control Structures Practice",
          description: "Implement various control structures in Java",
          dueDate: "May 15, 2025",
          status: "pending",
          module: "Module 3: Control Structures",
        },
        {
          id: 3,
          title: "OOP Project",
          description: "Build a simple application using OOP principles",
          dueDate: "May 25, 2025",
          status: "not_started",
          module: "Module 4: Object-Oriented Programming",
        },
      ]
    } else {
      // More generalized assignments for other courses
      return [
        {
          id: 1,
          title: `${code} Assignment 1`,
          description: "Complete the initial assignment for this course",
          dueDate: "April 20, 2025",
          status: "completed",
          grade: "B+",
          module: `Module 1: Introduction to ${code}`,
        },
        {
          id: 2,
          title: `${code} Assignment 2`,
          description: "Apply concepts from the second module",
          dueDate: "May 10, 2025",
          status: "pending",
          module: `Module 2: Core Concepts in ${code}`,
        },
      ]
    }
  }

  const generateResources = (code) => {
    if (code === "CS101") {
      return [
        {
          id: 1,
          title: "Java Programming Textbook",
          description: "Comprehensive guide to Java programming",
          type: "book",
          url: "#",
        },
        {
          id: 2,
          title: "Java API Documentation",
          description: "Official Java documentation",
          type: "link",
          url: "https://docs.oracle.com/en/java/",
        },
        {
          id: 3,
          title: "Code Examples Repository",
          description: "GitHub repository with example code",
          type: "repository",
          url: "#",
        },
      ]
    } else if (code.startsWith("PHY")) {
      return [
        {
          id: 1,
          title: "Physics Textbook",
          description: "Comprehensive guide to university physics",
          type: "book",
          url: "#",
        },
        {
          id: 2,
          title: "Physics Formulas Cheat Sheet",
          description: "Quick reference for important equations",
          type: "pdf",
          url: "#",
        },
        {
          id: 3,
          title: "Physics Simulations",
          description: "Interactive physics simulations for key concepts",
          type: "link",
          url: "https://phet.colorado.edu/",
        },
      ]
    } else {
      return [
        {
          id: 1,
          title: `${code} Course Textbook`,
          description: "Main reference material for the course",
          type: "book",
          url: "#",
        },
        {
          id: 2,
          title: `${code} Reference Guide`,
          description: "Supplementary materials and resources",
          type: "pdf",
          url: "#",
        },
        {
          id: 3,
          title: "Additional Reading",
          description: "Suggested articles and papers",
          type: "link",
          url: "#",
        },
      ]
    }
  }

  const generateSchedule = (code) => {
    // Using a deterministic approach based on course code
    const seed = code.charCodeAt(0) + code.charCodeAt(code.length - 1)
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    
    // Pick two days based on course code
    const day1 = days[seed % 5]
    const day2 = days[(seed + 2) % 5]
    
    // Generate room number based on course code
    const building = String.fromCharCode(65 + (seed % 3)) // A, B, or C
    const roomNumber = 100 + (seed % 10) * 10 + (seed % 5)
    const room = `${building}-${roomNumber}`
    
    return [
      { day: day1, time: "10:00 AM - 12:00 PM", room },
      { day: day2, time: "11:00 AM - 1:00 PM", room },
    ]
  }

  const generateForum = (code) => {
    // Common topics for any course
    const commonTopics = [
      {
        id: 1,
        title: "Question about Assignment 2",
        author: "John Doe",
        date: "April 28, 2025",
        replies: 3,
      },
      {
        id: 2,
        title: "Study group for midterm exam",
        author: "Michael Chen",
        date: "May 2, 2025",
        replies: 8,
      },
    ]
    
    // Course-specific topics
    if (code === "CS101") {
      commonTopics.push({
        id: 3,
        title: "Error in Module 2 example code",
        author: "Emma Johnson",
        date: "April 25, 2025",
        replies: 5,
      })
    } else if (code.startsWith("PHY")) {
      commonTopics.push({
        id: 3,
        title: "Confusion about lab procedures",
        author: "Sarah Williams",
        date: "April 30, 2025",
        replies: 4,
      })
    } else {
      commonTopics.push({
        id: 3,
        title: `Help understanding ${code} concepts`,
        author: "Alex Rodriguez",
        date: "May 1, 2025",
        replies: 6,
      })
    }
    
    return commonTopics
  }

  // Handler for edit form changes
  const handleEditChange = (field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handler for course update
  const handleUpdateCourse = async (realCourse) => {
    try {
      // Update the course
      setEditFormData(prev => ({
        ...prev,
        teacherId: realCourse.teacherId,
      }))
      console.log("Updating course with data:", editFormData, courseId)
      const response = await api.protected.fetchWithAuth(`/courses/${courseId}`, {
        method: "PUT",
        body: JSON.stringify(editFormData)
      })

      if (response.success) {
        toast({
          title: "Success",
          description: "Course updated successfully",
        })
        setIsEditing(false)
        // Refresh course data
        fetchCourseDetails()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update course",
        variant: "destructive",
      })
    }
  }

  // Handler for course deletion
  const handleDeleteCourse = async () => {
    try {
      const response = await api.protected.fetchWithAuth(`/courses/${courseId}`, {
        method: "DELETE"
      })

      if (response.success) {
        toast({
          title: "Success",
          description: "Course deleted successfully",
        })
        router.push("/dashboard/admin/courses")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div className="flex h-full items-center justify-center">Loading course details...</div>
  }

  // The rest of the component remains the same
  const InfoTabContent = () => (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Course Information</CardTitle>
            <CardDescription>Details about this course</CardDescription>
          </div>
          {tokenUtils.getUserRole() === "ADMIN" && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditFormData({
                    name: course.name,
                    code: course.code,
                    description: course.description,
                    teacherId: course.teacherId,
                    schedules: course.schedules
                  })
                  setIsEditing(true)
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Course</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this course? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteCourse} className="bg-destructive text-destructive-foreground">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Course Name</label>
                <Input
                  value={editFormData.name}
                  onChange={(e) => handleEditChange("name", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Course Code</label>
                <Input
                  value={editFormData.code}
                  onChange={(e) => handleEditChange("code", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editFormData.description}
                  onChange={(e) => handleEditChange("description", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleUpdateCourse(course)}>
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h3 className="mb-2 font-semibold">Description</h3>
                <p className="text-gray-700">{course.description}</p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Instructor</h3>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <Users className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">{course.instructor}</p>
                    <p className="text-sm text-gray-500">Department of {course.department}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Schedule</CardTitle>
          <CardDescription>Class times and locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {course.schedule.map((session, index) => (
              <div key={index} className="flex items-center justify-between rounded-md border p-3">
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
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{course.name}</h1>
            <p className="text-gray-500">
              {course.code} • Instructor: {course.instructor}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-lg">
          {course.progress}% Complete
        </Badge>
      </div>

      <Progress value={course.progress} className="h-2" />

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="content">
            <BookOpen className="mr-2 h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="announcements">
            <AlertCircle className="mr-2 h-4 w-4" />
            Announcements
          </TabsTrigger>
          <TabsTrigger value="assignments">
            <FileText className="mr-2 h-4 w-4" />
            Assignments
          </TabsTrigger>
          <TabsTrigger value="resources">
            <Download className="mr-2 h-4 w-4" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="forum">
            <MessageSquare className="mr-2 h-4 w-4" />
            Forum
          </TabsTrigger>
          <TabsTrigger value="info">
            <Calendar className="mr-2 h-4 w-4" />
            Info
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-6 space-y-6">
          <div className="space-y-6">
            {course.modules.map((module) => (
              <Card key={module.id} className={!module.isActive ? "opacity-60" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{module.title}</CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                    </div>
                    {module.completed ? (
                      <Badge variant="success">
                        <CheckCircle className="mr-1 h-3 w-3" /> Completed
                      </Badge>
                    ) : module.isActive ? (
                      <Badge>In Progress</Badge>
                    ) : (
                      <Badge variant="outline">Locked</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {module.content.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-start justify-between rounded-md border p-3 ${
                          !module.isActive ? "cursor-not-allowed" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {item.type === "lecture" && <FileText className="mt-0.5 h-5 w-5 text-blue-500" />}
                          {item.type === "video" && <Video className="mt-0.5 h-5 w-5 text-red-500" />}
                          {item.type === "assignment" && <FileText className="mt-0.5 h-5 w-5 text-amber-500" />}
                          {item.type === "quiz" && <FileText className="mt-0.5 h-5 w-5 text-green-500" />}
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-sm text-gray-500">{item.description}</div>
                            {item.type === "video" && (
                              <div className="mt-1 text-xs text-gray-500">
                                <Clock className="mr-1 inline-block h-3 w-3" />
                                {item.duration}
                              </div>
                            )}
                            {(item.type === "assignment" || item.type === "quiz") && (
                              <div className="mt-1 text-xs text-gray-500">
                                {item.dueDate && (
                                  <span>
                                    <Calendar className="mr-1 inline-block h-3 w-3" />
                                    Due: {item.dueDate}
                                  </span>
                                )}
                                {item.timeLimit && (
                                  <span>
                                    <Clock className="ml-2 mr-1 inline-block h-3 w-3" />
                                    Time: {item.timeLimit}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {item.completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {item.status === "completed" && (
                            <Badge variant="success" className="ml-2">
                              {item.grade}
                            </Badge>
                          )}
                          {module.isActive && (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild={item.type !== "assignment" && item.type !== "quiz"}
                            >
                              {item.type === "assignment" || item.type === "quiz" ? (
                                <span>
                                  {item.status === "completed"
                                    ? "View Submission"
                                    : item.status === "pending"
                                      ? "Submit"
                                      : "Start"}
                                </span>
                              ) : (
                                <Link href={item.fileUrl || item.videoUrl || "#"}>
                                  {item.type === "lecture" ? "View" : "Watch"}
                                </Link>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="announcements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Announcements</CardTitle>
              <CardDescription>Important updates and information from your instructor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {course.announcements.map((announcement) => (
                  <div key={announcement.id} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold">{announcement.title}</h3>
                      <span className="text-sm text-gray-500">{announcement.date}</span>
                    </div>
                    <p className="text-gray-700">{announcement.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Assignments</CardTitle>
              <CardDescription>All assignments for this course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {course.assignments.map((assignment) => (
                  <div key={assignment.id} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold">{assignment.title}</h3>
                      <Badge
                        variant={
                          assignment.status === "completed"
                            ? "success"
                            : assignment.status === "pending"
                              ? "default"
                              : "outline"
                        }
                      >
                        {assignment.status === "completed"
                          ? `Completed: ${assignment.grade}`
                          : assignment.status === "pending"
                            ? "Pending"
                            : "Not Started"}
                      </Badge>
                    </div>
                    <p className="mb-2 text-sm text-gray-700">{assignment.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <span className="mr-4">
                          <Calendar className="mr-1 inline-block h-3 w-3" />
                          Due: {assignment.dueDate}
                        </span>
                        <span>
                          <BookOpen className="mr-1 inline-block h-3 w-3" />
                          {assignment.module}
                        </span>
                      </div>
                      <Button variant="outline" size="sm">
                        {assignment.status === "completed"
                          ? "View Submission"
                          : assignment.status === "pending"
                            ? "Submit"
                            : "Start"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Resources</CardTitle>
              <CardDescription>Additional materials to support your learning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {course.resources.map((resource) => (
                  <div key={resource.id} className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <div className="font-medium">{resource.title}</div>
                      <div className="text-sm text-gray-500">{resource.description}</div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={resource.url} target="_blank">
                        {resource.type === "link" ? (
                          <>
                            <ExternalLink className="mr-2 h-4 w-4" /> Visit
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-4 w-4" /> Download
                          </>
                        )}
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forum" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Discussion Forum</CardTitle>
                <CardDescription>Discuss course topics with your instructor and peers</CardDescription>
              </div>
              <Button>New Discussion</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {course.forum.map((topic) => (
                  <div key={topic.id} className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <div className="font-medium">{topic.title}</div>
                      <div className="text-sm text-gray-500">
                        Started by {topic.author} • {topic.date}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline">{topic.replies} replies</Badge>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="mt-6">
          <InfoTabContent />
        </TabsContent>
      </Tabs>
    </div>
  )
}