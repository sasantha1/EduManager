"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserCheck, BookOpen, Bell, ArrowUpRight, ArrowDownRight, BarChart3 } from "lucide-react"
import { api, handleApiError } from "@/lib/api"

// Interface for dashboard data
interface DashboardData {
  totalStudents: number
  studentChange: number
  totalTeachers: number
  teacherChange: number
  totalCourses: number
  courseChange: number
  recentRegistrations: Array<{
    id: number
    name: string
    email: string
    date: string
    type: string
  }>
  systemNotifications: Array<{
    id: number
    title: string
    message: string
    date: string
  }>
}
interface User {
  id: number
  name: string
  email: string
  type: string
  date: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [allUsers, setAllUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch all students
        const studentsResponse = await api.protected.fetchWithAuth("/students")
        console.log("Students response:", studentsResponse)
        const students = studentsResponse.data || []

        // Fetch all teachers
        const teachersResponse = await api.protected.fetchWithAuth("/teachers")
        console.log("Teachers response:", teachersResponse)
        const teachers = teachersResponse.data || []

        // Fetch all courses
        const coursesResponse = await api.protected.fetchWithAuth("/courses")
        console.log("Courses response:", coursesResponse)
        const courses = coursesResponse.data || []

        // Calculate metrics
        // For change percentages, we'll assume we have previous semester data
        // In a real app, this would come from another API endpoint or stored data
        const previousStudents = students.length * 0.95 // Mock 5% less for demo
        const previousTeachers = teachers.length * 1.021 // Mock 2.1% more
        const previousCourses = courses.length * 0.962 // Mock 3.8% less

        // Prepare recent registrations (last 3 users, sorted by creation date)
        // Combine students and teachers for recent registrations
        const allUsers = [
          ...students.map((user: any) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            date: new Date(user.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            }),
            type: 'Student'
          })),
          ...teachers.map((user: any) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            date: new Date(user.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            }),
            type: 'Teacher'
          }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        setAllUsers(allUsers)

        const recentRegistrations = allUsers
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3)
          .map((user: any) => ({
            id: user.id,
            name: `${user.name}`,
            email: user.email,
            date: new Date(user.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            }),
            type: user.role
          }))

        // Mock system notifications (since there's no endpoint in provided backend)
        // In a real app, this would be another API call
        const systemNotifications = [
          {
            id: 1,
            title: "System Maintenance",
            message: "Scheduled maintenance on May 20, 2025",
            date: "May 5, 2025"
          },
          {
            id: 2,
            title: "New Feature Released",
            message: "Attendance tracking module is now available",
            date: "May 3, 2025"
          }
        ]

        setDashboardData({
          totalStudents: students.length,
          studentChange: ((students.length - previousStudents) / previousStudents * 100),
          totalTeachers: teachers.length,
          teacherChange: ((teachers.length - previousTeachers) / previousTeachers * 100),
          totalCourses: courses.length,
          courseChange: ((courses.length - previousCourses) / previousCourses * 100),
          recentRegistrations,
          systemNotifications
        })
      } catch (err) {
        const errorResponse = handleApiError(err)
        setError(errorResponse.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return <div className="flex h-full items-center justify-center">Loading dashboard...</div>
  }

  if (error) {
    return <div className="flex h-full items-center justify-center text-red-500">{error}</div>
  }

  if (!dashboardData) {
    return <div className="flex h-full items-center justify-center">No data available</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalStudents}</div>
            <div className="flex items-center text-xs">
              {dashboardData.studentChange > 0 ? (
                <>
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">{dashboardData.studentChange.toFixed(1)}% increase</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                  <span className="text-red-500">{Math.abs(dashboardData.studentChange).toFixed(1)}% decrease</span>
                </>
              )}
              <span className="ml-1 text-gray-500">from last semester</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <UserCheck className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalTeachers}</div>
            <div className="flex items-center text-xs">
              {dashboardData.teacherChange > 0 ? (
                <>
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">{dashboardData.teacherChange.toFixed(1)}% increase</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                  <span className="text-red-500">{Math.abs(dashboardData.teacherChange).toFixed(1)}% decrease</span>
                </>
              )}
              <span className="ml-1 text-gray-500">from last semester</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalCourses}</div>
            <div className="flex items-center text-xs">
              {dashboardData.courseChange > 0 ? (
                <>
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">{dashboardData.courseChange.toFixed(1)}% increase</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                  <span className="text-red-500">{Math.abs(dashboardData.courseChange).toFixed(1)}% decrease</span>
                </>
              )}
              <span className="ml-1 text-gray-500">from last semester</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Registrations</CardTitle>
            <CardDescription>New users who have registered in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isExpanded
                ? allUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{user.type}</div>
                      <div className="text-xs text-gray-500">{user.date}</div>
                    </div>
                  </div>
                ))
                : dashboardData.recentRegistrations.map((registration) => (
                  <div key={registration.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{registration.name}</div>
                      <div className="text-sm text-gray-500">{registration.email}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{registration.type}</div>
                      <div className="text-xs text-gray-500">{registration.date}</div>
                    </div>
                  </div>
                ))
              }
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Show Less" : "View All Users"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="col-span-1 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>System Notifications</CardTitle>
                <CardDescription>Important system updates and announcements</CardDescription>
              </div>
              <Bell className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.systemNotifications.map((notification) => (
                  <div key={notification.id} className="border-b pb-3 last:border-0 last:pb-0">
                    <div className="font-medium">{notification.title}</div>
                    <div className="text-sm text-gray-500">{notification.message}</div>
                    <div className="mt-1 text-xs text-gray-400">Posted on {notification.date}</div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  Manage Notifications
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-2">
                <Button variant="outline" className="justify-start" onClick={() => router.push('/dashboard/admin/students/add')}>
                  <Users className="mr-2 h-4 w-4" />
                  Add New Student
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => router.push('/dashboard/admin/teachers/add')}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Add New Teacher
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => router.push('/dashboard/admin/courses/add')}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Create Course
                </Button>
                
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}