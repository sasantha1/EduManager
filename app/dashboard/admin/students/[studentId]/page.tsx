"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function StudentDetailsPage({ params }: { params: Promise<{ studentId: string }> }) {
  const resolvedParams = use(params)
  const [student, setStudent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentId: "",
    program: "",
    year: "",
  })

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await api.protected.fetchWithAuth(`/students/${resolvedParams.studentId}/courses`)
        console.log(response)
        if (!response.success) {
          throw new Error(response.message || "Failed to fetch student data")
        }
        
        // Split the full name into first and last name
        const [firstName = "", lastName = ""] = response.data.name?.split(" ") || []
        console.log(firstName, lastName)
        setStudent(response.data)
        setFormData({
          firstName: firstName,
          lastName: lastName,
          email: response.data.email,
          studentId: response.data.studentId,
          program: response.data.program,
          year: response.data.year,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load student details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudentData()
  }, [resolvedParams.studentId, toast])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const updateData = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim()
      }
      
      const response = await api.protected.fetchWithAuth(`/students/${resolvedParams.studentId}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      })
      
      if (!response.success) {
        throw new Error(response.message || "Failed to update student")
      }

      toast({
        title: "Success",
        description: "Student details updated successfully",
      })
      setIsEditing(false)
      setStudent({ ...student, ...formData })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update student details",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Student Details</h1>
        <div className="space-x-2">
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              Edit Details
            </Button>
          )}
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="courses">Enrolled Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            {isEditing ? (
              <form onSubmit={handleUpdate}>
                <CardHeader>
                  <CardTitle>Edit Student Information</CardTitle>
                  <CardDescription>Make changes to student details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Student ID</Label>
                      <Input
                        id="studentId"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        required
                        pattern="^S\d{4,}$"
                        title="Student ID must start with 'S' followed by at least 4 digits"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="program">Program</Label>
                      <Select
                        value={formData.program}
                        onValueChange={(value) => handleSelectChange("program", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                          <SelectItem value="Business Administration">Business Administration</SelectItem>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Medicine">Medicine</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Select
                        value={formData.year}
                        onValueChange={(value) => handleSelectChange("year", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1st Year">1st Year</SelectItem>
                          <SelectItem value="2nd Year">2nd Year</SelectItem>
                          <SelectItem value="3rd Year">3rd Year</SelectItem>
                          <SelectItem value="4th Year">4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Changes
                  </Button>
                </CardFooter>
              </form>
            ) : (
              <>
                <CardHeader>
                  <CardTitle>Student Information</CardTitle>
                  <CardDescription>View student details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>First Name</Label>
                      <p className="text-lg">{formData?.firstName}</p>
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      <p className="text-lg">{formData?.lastName}</p>
                    </div>
                    <div>
                      <Label>Student ID</Label>
                      <p className="text-lg">{student.studentId}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="text-lg">{student.email}</p>
                    </div>
                    <div>
                      <Label>Program</Label>
                      <p className="text-lg">{student.program}</p>
                    </div>
                    <div>
                      <Label>Year</Label>
                      <p className="text-lg">{student.year}</p>
                    </div>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Courses</CardTitle>
              <CardDescription>Courses the student is currently enrolled in</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {student.enrolledCourses && student.enrolledCourses.length > 0 ? (
                  <div className="space-y-4">
                    {student.enrolledCourses.map((course) => (
                      <Card key={course.id}>
                        <CardHeader>
                          <CardTitle>{course.code} - {course.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p><strong>Credits:</strong> {course.credits}</p>
                          <p><strong>Description:</strong> {course.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p>No courses enrolled</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}