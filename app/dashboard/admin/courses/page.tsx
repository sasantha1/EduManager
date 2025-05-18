"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Users,
  Download,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  BookOpen,
} from "lucide-react"
import { api } from "@/lib/api"

// Interface for Course data
interface Schedule {
  id: number
  day: string
  startTime: string
  endTime: string
  room: string
}

interface Course {
  id: number
  name: string
  code: string
  description: string
  teacherId: string
  schedules: Schedule[] 
  createdAt: string
  updatedAt: string
}

interface Teacher {
  id: number
  name: string
  email: string
  role: string
  status: string
  teacherId: string
  department: string
}

export default function CoursesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("All Departments")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [teachers, setTeachers] = useState<Map<string, Teacher>>(new Map())
  const itemsPerPage = 8

  const router = useRouter()
  const { toast } = useToast()

  // Fetch courses and teacher data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesResponse = await api.protected.fetchWithAuth("/courses")
        console.log("Courses Response:", coursesResponse)
        if (coursesResponse.success) {
          setCourses(coursesResponse.data)
          setFilteredCourses(coursesResponse.data)
          
          // Fetch teacher details for each unique teacherId
          const uniqueTeacherIds = [...new Set(coursesResponse.data.map(course => course.teacherId))]
          const teacherMap = new Map<string, Teacher>()
          
          await Promise.all(
            uniqueTeacherIds.map(async (teacherId) => {
              const teacherResponse = await api.protected.fetchWithAuth(`/teachers/teacherId/${teacherId}`)
              if (teacherResponse.success) {
                teacherMap.set(teacherId, teacherResponse.data)
              }
            })
          )
          
          setTeachers(teacherMap)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch courses. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // Get unique departments from teachers
  const departments = ["All Departments", ...new Set(Array.from(teachers.values()).map(teacher => teacher.department))]

  useEffect(() => {
    // Apply filters and search
    let result = [...courses]

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (course) =>
          course.name.toLowerCase().includes(query) ||
          course.code.toLowerCase().includes(query) ||
          teachers.get(course.teacherId)?.name.toLowerCase().includes(query)
      )
    }

    // Apply department filter
    if (departmentFilter !== "All Departments") {
      result = result.filter((course) => teachers.get(course.teacherId)?.department === departmentFilter)
    }

    setFilteredCourses(result)
    setCurrentPage(1)
  }, [courses, searchQuery, departmentFilter, teachers])

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + itemsPerPage)

  const handleDeleteCourse = async (courseId: number) => {
    try {
      const response = await api.protected.fetchWithAuth(`/courses/${courseId}`, {
        method: "DELETE",
      })

      if (response.success) {
        setCourses(courses.filter((course) => course.id !== courseId))
        toast({
          title: "Course deleted",
          description: `Course has been deleted successfully.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete course. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCloneCourse = (courseId: number) => {
    const courseToCopy = courses.find((course) => course.id === courseId)
    if (courseToCopy) {
      toast({
        title: "Course cloned",
        description: `Course ${courseId} has been cloned. You can now edit the new course.`,
      })

      router.push("/dashboard/admin/courses/add")
    }
  }

  const handleResetFilters = () => {
    setSearchQuery("")
    setDepartmentFilter("All Departments")
  }

  const exportCourses = () => {
    try {
      // Create CSV headers
      const headers = ['Course Code,Course Name,Description,Department,Instructor,Schedules\n'];
      
      // Convert courses data to CSV format
      const csvData = filteredCourses.map(course => {
        const teacher = teachers.get(course.teacherId);
        const schedules = course.schedules
          .map(s => `${s.day} ${s.startTime}-${s.endTime} (${s.room})`)
          .join('; ');
        
        return [
          course.code,
          course.name.replace(/,/g, ';'), // Replace commas with semicolons to avoid CSV issues
          course.description.replace(/,/g, ';'),
          teacher?.department || '',
          teacher?.name || '',
          schedules
        ].join(',');
      }).join('\n');
  
      // Combine headers and data
      const csvContent = headers + csvData;
  
      // Create blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      // Set up download link
      link.setAttribute('href', url);
      link.setAttribute('download', `courses_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      
      // Trigger download and cleanup
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
  
      toast({
        title: "Export successful",
        description: "Courses data has been exported to CSV.",
        variant: "default",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "Failed to export courses data. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading courses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Courses</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportCourses}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button asChild>
            <Link href="/dashboard/admin/courses/add">
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Course Management</CardTitle>
          <CardDescription>Manage all courses in the system. Add, edit, or remove courses as needed.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search courses..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="h-10">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {departmentFilter !== "All Departments" && (
                  <Badge variant="secondary" className="ml-2">
                    1
                  </Badge>
                )}
              </Button>
              {departmentFilter !== "All Departments" && (
                <Button variant="ghost" size="sm" onClick={handleResetFilters} className="h-10">
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 border rounded-md bg-muted/20">
              <div>
                <label className="text-sm font-medium mb-1 block">Department</label>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {filteredCourses.length === 0 ? (
            <div className="text-center py-10 border rounded-md">
              <p className="text-muted-foreground">No courses found matching your criteria.</p>
              <Button variant="link" onClick={handleResetFilters}>
                Reset filters
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Course Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCourses.map((course) => {
                      const teacher = teachers.get(course.teacherId)
                      return (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.code}</TableCell>
                          <TableCell>
                            <div className="font-medium">{course.name}</div>
                            <div className="text-xs text-muted-foreground">{course.description}</div>
                          </TableCell>
                          <TableCell>{teacher?.department}</TableCell>
                          <TableCell>{teacher?.name}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {course.schedules.map((schedule, index) => (
                                <div key={schedule.id} className="text-xs">
                                  {schedule.day} {schedule.startTime}-{schedule.endTime}
                                  {index < course.schedules.length - 1 && ", "}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/courses/${course.id}`)}>
                                  <BookOpen className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                
                                
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredCourses.length)} of{" "}
                    {filteredCourses.length} courses
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-sm">
                      Page {currentPage} of {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
