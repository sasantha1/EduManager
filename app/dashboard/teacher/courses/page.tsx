"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Users, Calendar, Clock, BookOpen, MoreVertical, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { api, tokenUtils } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function TeacherCoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    const fetchTeacherCourses = async () => {
      try {
        const userData = tokenUtils.getUserData()
        if (!userData || !userData.id) {
          toast({
            title: "Authentication error",
            description: "Please log in again to view your courses.",
            variant: "destructive",
          })
          return
        }
        // Fetch the teacher's courses using their user ID (teacher ID)
        const coursesResponse = await api.protected.fetchWithAuth(`/courses/teacher/${userData.id}`)
        console.log("Courses response:", coursesResponse)
        
        if (coursesResponse.success && coursesResponse.data) {
          // Use the actual course data with real schedules
          setCourses(coursesResponse.data)
        } else {
          throw new Error(coursesResponse.message || "Failed to fetch courses")
        }
      } catch (error) {
        console.error("Error fetching teacher courses:", error)
        toast({
          title: "Error loading courses",
          description: "Failed to load your courses. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeacherCourses()
  }, [toast])

  // Removed the generateSchedule and generateStudentCount helper functions as we're now using real data

  // Handler for creating a new course
  const handleCreateCourse = () => {
    router.push("/dashboard/teacher/courses/new")
  }

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && course.status === activeTab
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading courses...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={handleCreateCourse}>
            <Plus className="mr-2 h-4 w-4" /> New Course
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No courses found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="active" className="mt-6">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No active courses found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="archived" className="mt-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">No archived courses found.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CourseCard({ course }) {
  // Helper function to format time from API time format (HH:MM:SS) to AM/PM format
  const formatTimeToAMPM = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    let hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${hour}:${minutes} ${ampm}`;
  };

  // Helper function to format day from API enum format (MONDAY) to Title Case (Monday)
  const formatDay = (day) => {
    if (!day) return "";
    return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="outline" className="mb-2">
              {course.code}
            </Badge>
            <CardTitle className="text-xl">{course.name}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link href={`/dashboard/student/courses/${course.id}`} className="w-full">
                  View Course
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/dashboard/teacher/courses/${course.id}/edit`} className="w-full">
                  Edit Course
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
      </CardContent>
      <CardContent className="pb-2">
        {/* Student count section removed as we're using actual data */}
      </CardContent>
      <CardContent className="pb-2">
        <div className="space-y-1">
          {course.schedules && course.schedules.map((schedule, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDay(schedule.day)}</span>
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {formatTimeToAMPM(schedule.startTime)} - {formatTimeToAMPM(schedule.endTime)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm pl-6">
                <span className="text-muted-foreground">Room:</span>
                <span>{schedule.room || "Not assigned"}</span>
              </div>
            </div>
          ))}
          {/* If schedules array is empty or undefined, show a placeholder */}
          {(!course.schedules || course.schedules.length === 0) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>No schedule information available</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/dashboard/teacher/courses/${course.id}`}>
            <BookOpen className="mr-2 h-4 w-4" /> Open Course
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}