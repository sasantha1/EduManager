"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Search, Filter, CheckCircle } from "lucide-react"

export default function AssignmentsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [assignments, setAssignments] = useState([])
  const [filteredAssignments, setFilteredAssignments] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [courseFilter, setCourseFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [courses, setCourses] = useState([])

  useEffect(() => {
    // In a real app, this would fetch assignments from an API
    // For demo purposes, we'll use mock data
    setTimeout(() => {
      const assignmentsData = [
        {
          id: 1,
          courseId: 1,
          title: "Environment Setup Verification",
          description: "Submit screenshots of your working environment",
          dueDate: "April 10, 2025",
          status: "completed",
          grade: "A",
          course: "CS101 - Introduction to Programming",
          courseCode: "CS101",
        },
        {
          id: 2,
          courseId: 1,
          title: "Control Structures Practice",
          description: "Implement various control structures in Java",
          dueDate: "May 15, 2025",
          status: "pending",
          course: "CS101 - Introduction to Programming",
          courseCode: "CS101",
        },
        {
          id: 3,
          courseId: 1,
          title: "OOP Project",
          description: "Build a simple application using OOP principles",
          dueDate: "May 25, 2025",
          status: "not_started",
          course: "CS101 - Introduction to Programming",
          courseCode: "CS101",
        },
        {
          id: 4,
          courseId: 2,
          title: "Lab Report",
          description: "Write a report on the pendulum experiment",
          dueDate: "May 18, 2025",
          status: "pending",
          course: "PHYS201 - Introduction to Physics",
          courseCode: "PHYS201",
        },
        {
          id: 5,
          courseId: 2,
          title: "Problem Set 2",
          description: "Solve problems related to Newton's laws of motion",
          dueDate: "April 25, 2025",
          status: "completed",
          grade: "B+",
          course: "PHYS201 - Introduction to Physics",
          courseCode: "PHYS201",
        },
        {
          id: 6,
          courseId: 3,
          title: "Essay: Modern Poetry Analysis",
          description: "Analyze the themes in selected modern poems",
          dueDate: "May 20, 2025",
          status: "pending",
          course: "ENG102 - English Literature",
          courseCode: "ENG102",
        },
        {
          id: 7,
          courseId: 3,
          title: "Reading Response 5",
          description: "Respond to the assigned readings on modernist literature",
          dueDate: "May 5, 2025",
          status: "completed",
          grade: "A-",
          course: "ENG102 - English Literature",
          courseCode: "ENG102",
        },
      ]

      setAssignments(assignmentsData)
      setFilteredAssignments(assignmentsData)

      // Extract unique courses for the filter
      const uniqueCourses = [...new Set(assignmentsData.map((assignment) => assignment.courseCode))]
      setCourses(uniqueCourses)

      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    // Filter assignments based on search query, course filter, and status filter
    let filtered = assignments

    if (searchQuery) {
      filtered = filtered.filter(
        (assignment) =>
          assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          assignment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          assignment.course.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (courseFilter !== "all") {
      filtered = filtered.filter((assignment) => assignment.courseCode === courseFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((assignment) => assignment.status === statusFilter)
    }

    setFilteredAssignments(filtered)
  }, [searchQuery, courseFilter, statusFilter, assignments])

  if (isLoading) {
    return <div className="flex h-full items-center justify-center">Loading assignments...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Assignments</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Assignments</CardTitle>
          <CardDescription>View and manage your assignments across all courses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search assignments..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={courseFilter} onValueChange={setCourseFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course} value={course}>
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="not_started">Not Started</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="space-y-4">
                {filteredAssignments.length === 0 ? (
                  <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                    <p className="text-gray-500">No assignments found matching your filters.</p>
                  </div>
                ) : (
                  filteredAssignments.map((assignment) => (
                    <div key={assignment.id} className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <Link
                          href={`/dashboard/student/courses/${assignment.courseId}/assignments/${assignment.id}`}
                          className="font-semibold hover:underline"
                        >
                          {assignment.title}
                        </Link>
                        <Badge
                          variant={
                            assignment.status === "completed"
                              ? "success"
                              : assignment.status === "pending"
                                ? "default"
                                : "outline"
                          }
                        >
                          {assignment.status === "completed" ? (
                            <>
                              <CheckCircle className="mr-1 h-3 w-3" />
                              {assignment.grade ? `Completed: ${assignment.grade}` : "Completed"}
                            </>
                          ) : assignment.status === "pending" ? (
                            "Pending"
                          ) : (
                            "Not Started"
                          )}
                        </Badge>
                      </div>
                      <p className="mb-2 text-sm text-gray-700">{assignment.description}</p>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-sm text-gray-500">
                          <span className="mr-4">
                            <Calendar className="mr-1 inline-block h-3 w-3" />
                            Due: {assignment.dueDate}
                          </span>
                          <span>
                            <Clock className="mr-1 inline-block h-3 w-3" />
                            {assignment.course}
                          </span>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/student/courses/${assignment.courseId}/assignments/${assignment.id}`}>
                            {assignment.status === "completed"
                              ? "View Submission"
                              : assignment.status === "pending"
                                ? "Continue"
                                : "Start"}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
            <TabsContent value="pending" className="mt-4">
              <div className="space-y-4">
                {filteredAssignments.filter((a) => a.status === "pending").length === 0 ? (
                  <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                    <p className="text-gray-500">No pending assignments found.</p>
                  </div>
                ) : (
                  filteredAssignments
                    .filter((a) => a.status === "pending")
                    .map((assignment) => (
                      <div key={assignment.id} className="rounded-lg border p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <Link
                            href={`/dashboard/student/courses/${assignment.courseId}/assignments/${assignment.id}`}
                            className="font-semibold hover:underline"
                          >
                            {assignment.title}
                          </Link>
                          <Badge>Pending</Badge>
                        </div>
                        <p className="mb-2 text-sm text-gray-700">{assignment.description}</p>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="text-sm text-gray-500">
                            <span className="mr-4">
                              <Calendar className="mr-1 inline-block h-3 w-3" />
                              Due: {assignment.dueDate}
                            </span>
                            <span>
                              <Clock className="mr-1 inline-block h-3 w-3" />
                              {assignment.course}
                            </span>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={`/dashboard/student/courses/${assignment.courseId}/assignments/${assignment.id}`}
                            >
                              Continue
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </TabsContent>
            <TabsContent value="completed" className="mt-4">
              <div className="space-y-4">
                {filteredAssignments.filter((a) => a.status === "completed").length === 0 ? (
                  <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                    <p className="text-gray-500">No completed assignments found.</p>
                  </div>
                ) : (
                  filteredAssignments
                    .filter((a) => a.status === "completed")
                    .map((assignment) => (
                      <div key={assignment.id} className="rounded-lg border p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <Link
                            href={`/dashboard/student/courses/${assignment.courseId}/assignments/${assignment.id}`}
                            className="font-semibold hover:underline"
                          >
                            {assignment.title}
                          </Link>
                          <Badge variant="success">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            {assignment.grade ? `Completed: ${assignment.grade}` : "Completed"}
                          </Badge>
                        </div>
                        <p className="mb-2 text-sm text-gray-700">{assignment.description}</p>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="text-sm text-gray-500">
                            <span className="mr-4">
                              <Calendar className="mr-1 inline-block h-3 w-3" />
                              Due: {assignment.dueDate}
                            </span>
                            <span>
                              <Clock className="mr-1 inline-block h-3 w-3" />
                              {assignment.course}
                            </span>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={`/dashboard/student/courses/${assignment.courseId}/assignments/${assignment.id}`}
                            >
                              View Submission
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </TabsContent>
            <TabsContent value="upcoming" className="mt-4">
              <div className="space-y-4">
                {filteredAssignments.filter((a) => a.status === "not_started").length === 0 ? (
                  <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                    <p className="text-gray-500">No upcoming assignments found.</p>
                  </div>
                ) : (
                  filteredAssignments
                    .filter((a) => a.status === "not_started")
                    .map((assignment) => (
                      <div key={assignment.id} className="rounded-lg border p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <Link
                            href={`/dashboard/student/courses/${assignment.courseId}/assignments/${assignment.id}`}
                            className="font-semibold hover:underline"
                          >
                            {assignment.title}
                          </Link>
                          <Badge variant="outline">Not Started</Badge>
                        </div>
                        <p className="mb-2 text-sm text-gray-700">{assignment.description}</p>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="text-sm text-gray-500">
                            <span className="mr-4">
                              <Calendar className="mr-1 inline-block h-3 w-3" />
                              Due: {assignment.dueDate}
                            </span>
                            <span>
                              <Clock className="mr-1 inline-block h-3 w-3" />
                              {assignment.course}
                            </span>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={`/dashboard/student/courses/${assignment.courseId}/assignments/${assignment.id}`}
                            >
                              Start
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
