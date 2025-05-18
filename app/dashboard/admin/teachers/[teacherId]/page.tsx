"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, BookOpen, Mail, Building2, UserRound, GraduationCap, Clock } from "lucide-react"
import { api } from "@/lib/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function TeacherDetailsPage({ params: paramsPromise }) {
  const params = use(paramsPromise)
  const [teacher, setTeacher] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    teacherId: "",
    department: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      try {
        const response = await api.protected.fetchWithAuth(`/teachers/${params.teacherId}`)
        console.log("Teacher details response:", response)
        if (response.success) {
          setTeacher(response.data)
        } else {
          throw new Error(response.message || "Failed to fetch teacher details")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
        router.push("/dashboard/admin/teachers")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeacherDetails()
  }, [params.teacherId])

  useEffect(() => {
    if (teacher) {
      const [firstName, ...lastNameParts] = teacher.name.split(" ")
      const lastName = lastNameParts.join(" ")
      setEditForm({
        firstName,
        lastName,
        email: teacher.email,
        teacherId: teacher.teacherId,
        department: teacher.department,
      })
    }
  }, [teacher])

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    console.log("Teacher id:", teacher.teacherId)
    try {
      const response = await api.protected.fetchWithAuth(`/teachers/${params.teacherId}`, {
        method: "PUT",
        body: JSON.stringify({
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          email: editForm.email,
          teacherId: teacher.teacherId,
          department: editForm.department,
        }),
      })

      if (response.success) {
        setTeacher({
          ...response.data,
          name: `${editForm.firstName} ${editForm.lastName}`, // Update the display name
        })
        setIsEditing(false)
        toast({
          title: "Success",
          description: "Teacher details updated successfully",
        })
      } else {
        throw new Error(response.message || "Failed to update teacher")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const renderEditForm = () => (
    <form onSubmit={handleEditSubmit} className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRound className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={editForm.firstName}
                onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={editForm.lastName}
                onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="teacherId">Teacher ID</Label>
            <Input
              id="teacherId"
              value={editForm.teacherId}
              disabled // Make teacherId read-only
              className="bg-muted"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Department Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select 
              value={editForm.department}
              onValueChange={(value) => setEditForm(prev => ({ ...prev, department: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="md:col-span-2 flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!teacher) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Teacher Details</h1>
        </div>
        <Button 
          variant={isEditing ? "default" : "outline"}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel Edit" : "Edit Teacher"}
        </Button>
      </div>

      {isEditing ? (
        renderEditForm()
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-lg">{teacher.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-lg flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {teacher.email}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Teacher ID</p>
                <p className="text-lg">{teacher.teacherId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant={teacher.status === "ACTIVE" ? "success" : "secondary"}>
                  {teacher.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Department Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Department</p>
                <p className="text-lg">{teacher.department}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Join Date</p>
                <p className="text-lg flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {format(new Date(teacher.createdAt), 'PPP')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Assigned Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teacher.assignedCourses && teacher.assignedCourses.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course Code</TableHead>
                      <TableHead>Course Name</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teacher.assignedCourses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>{course.courseCode}</TableCell>
                        <TableCell>{course.name}</TableCell>
                        <TableCell>{course.credits}</TableCell>
                        <TableCell>
                          <Badge variant="outline">Active</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <GraduationCap className="h-12 w-12 mb-2" />
                  <p>No courses assigned yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}