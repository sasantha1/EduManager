"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Download, Filter, ArrowUpDown, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Alex Johnson",
      studentId: "S10045",
      email: "alex.johnson@university.edu",
      program: "Computer Science",
      year: "3rd Year",
      courses: ["CS101", "CS202", "CS350"],
      status: "active",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Emma Wilson",
      studentId: "S10078",
      email: "emma.wilson@university.edu",
      program: "Computer Science",
      year: "2nd Year",
      courses: ["CS101", "CS280"],
      status: "active",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Michael Brown",
      studentId: "S10092",
      email: "michael.brown@university.edu",
      program: "Data Science",
      year: "4th Year",
      courses: ["CS202", "CS405"],
      status: "active",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Sophia Lee",
      studentId: "S10103",
      email: "sophia.lee@university.edu",
      program: "Computer Engineering",
      year: "3rd Year",
      courses: ["CS101", "CS350"],
      status: "active",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      name: "Daniel Martinez",
      studentId: "S10118",
      email: "daniel.martinez@university.edu",
      program: "Computer Science",
      year: "1st Year",
      courses: ["CS101"],
      status: "active",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 6,
      name: "Olivia Taylor",
      studentId: "S10125",
      email: "olivia.taylor@university.edu",
      program: "Software Engineering",
      year: "2nd Year",
      courses: ["CS101", "CS280"],
      status: "active",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 7,
      name: "James Anderson",
      studentId: "S10132",
      email: "james.anderson@university.edu",
      program: "Computer Science",
      year: "4th Year",
      courses: ["CS350", "CS405"],
      status: "active",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 8,
      name: "Ava Thomas",
      studentId: "S10147",
      email: "ava.thomas@university.edu",
      program: "Artificial Intelligence",
      year: "3rd Year",
      courses: ["CS202", "CS405"],
      status: "active",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [courseFilter, setCourseFilter] = useState("all")
  const [programFilter, setProgramFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" })

  const courses = ["CS101", "CS202", "CS280", "CS350", "CS405"]
  const programs = [
    "Computer Science",
    "Data Science",
    "Computer Engineering",
    "Software Engineering",
    "Artificial Intelligence",
  ]
  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"]

  const handleSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCourse = courseFilter === "all" || student.courses.includes(courseFilter)
    const matchesProgram = programFilter === "all" || student.program === programFilter
    const matchesYear = yearFilter === "all" || student.year === yearFilter

    return matchesSearch && matchesCourse && matchesProgram && matchesYear
  })

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1
    }
    return 0
  })

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">My Students</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search students..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-1">
          <CardTitle>Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter by:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Course" />
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

              <Select value={programFilter} onValueChange={setProgramFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  {programs.map((program) => (
                    <SelectItem key={program} value={program}>
                      {program}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">
                    <Button
                      variant="ghost"
                      className="flex items-center gap-1 p-0 h-auto font-medium"
                      onClick={() => handleSort("name")}
                    >
                      Student
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-1 p-0 h-auto font-medium"
                      onClick={() => handleSort("studentId")}
                    >
                      ID
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-1 p-0 h-auto font-medium"
                      onClick={() => handleSort("program")}
                    >
                      Program
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-1 p-0 h-auto font-medium"
                      onClick={() => handleSort("year")}
                    >
                      Year
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No students found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={student.profileImage || "/placeholder.svg"} alt={student.name} />
                            <AvatarFallback>
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div>{student.name}</div>
                            <div className="text-xs text-muted-foreground">{student.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>{student.program}</TableCell>
                      <TableCell>{student.year}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {student.courses.map((course) => (
                            <Badge key={course} variant="outline">
                              {course}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Link href={`/dashboard/teacher/students/${student.id}`} className="w-full">
                                View Profile
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>View Grades</DropdownMenuItem>
                            <DropdownMenuItem>View Submissions</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Send Message</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
