"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Mail, UserCog } from "lucide-react"
import { api } from "@/lib/api"

export default function TeachersPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [teachers, setTeachers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("All Departments")
  const router = useRouter()
  const { toast } = useToast()

  const fetchTeachers = async () => {
    try {
      const response = await api.protected.fetchWithAuth("/teachers")
      console.log("Teachers response:", response)
      if (response.success) {
        setTeachers(response.data)
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch teachers",
        variant: "destructive",
      })
      console.error("Error fetching teachers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTeachers()
  }, [])

  const handleDeleteTeacher = async (teacherId) => {
    try {
      const response = await api.protected.fetchWithAuth(`/teachers/${teacherId}`, {
        method: "DELETE",
      })

      if (response.success) {
        toast({
          title: "Success",
          description: "Teacher deleted successfully",
        })
        fetchTeachers() // Refresh the list
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete teacher",
        variant: "destructive",
      })
    }
  }

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch = 
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.teacherId.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDepartment = 
      departmentFilter === "All Departments" || 
      teacher.department === departmentFilter

    return matchesSearch && matchesDepartment
  })

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Teachers</h1>
        <Button asChild>
          <Link href="/dashboard/admin/teachers/add">
            <Plus className="h-4 w-4 mr-2" />
            Add Teacher
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Teacher Management</CardTitle>
          <CardDescription>View and manage all teachers in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search teachers..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Departments">All Departments</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                {/* Add other departments */}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.teacherId}>
                    <TableCell>{teacher.teacherId}</TableCell>
                    <TableCell>{`${teacher.name}`}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.department}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/teachers/${teacher.id}`)}>
                            <UserCog className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/teachers/${teacher.id}/edit`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                         
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
