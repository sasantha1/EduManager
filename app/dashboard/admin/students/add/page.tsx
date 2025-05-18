"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"

export default function AddStudentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentId: "",
    program: "",
    year: "1st Year",
    dateOfBirth: "",
    address: "",
    phone: "",
    sendCredentials: true,
  })
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked) => {
    setFormData((prev) => ({ ...prev, sendCredentials: checked }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare the student registration data according to backend DTO
      const studentData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: generateTempPassword(), // Generate a temporary password
        studentId: formData.studentId,
        program: formData.program,
        year: formData.year,
      }
      console.log("Student Data:", studentData)

      // Make API call to create student
      const response = await api.protected.fetchWithAuth("/students", {
        method: "POST",
        body: JSON.stringify(studentData),
      })
      
      if (!response.success) {
        throw new Error(response.message || "Failed to add student")
      }

      // If sendCredentials is checked, send email with login details
      if (formData.sendCredentials) {
        await api.protected.fetchWithAuth("/api/students/send-credentials", {
          method: "POST",
          body: JSON.stringify({
            studentId: response.data.id,
            email: formData.email,
          }),
        })
      }

      toast({
        title: "Student added",
        description: `${formData.firstName} ${formData.lastName} has been added successfully.`,
      })

      router.push("/dashboard/admin/students")
    } catch (error) {
      alert("Error adding student:", error)
      console.error("Error adding student:", error)
      toast({
        title: "Error adding student",
        description: error.message || "There was an error adding the student. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper function to generate a temporary password
  const generateTempPassword = () => {
    const length = 10
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let password = ""
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    alert(`Temporary password: ${password}`)
    return password
  }

  // Add validation for student ID pattern
  const validateStudentId = (id: string) => {
    const pattern = /^S\d{4,}$/
    return pattern.test(id)
  }

  const generateStudentId = () => {
    const randomId = Math.floor(1000 + Math.random() * 9000)
    const newStudentId = `S${randomId}`
    if (validateStudentId(newStudentId)) {
      setFormData((prev) => ({ ...prev, studentId: newStudentId }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Add New Student</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
            <CardDescription>Enter the details of the new student</CardDescription>
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
                  placeholder="Enter first name"
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
                  placeholder="Enter last name"
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
                  placeholder="student@example.com"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input
                      id="studentId"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      required
                      pattern="^S\d{4,}$"
                      placeholder="e.g., S1234"
                      title="Student ID must start with 'S' followed by at least 4 digits"
                    />
                  </div>
                  <Button type="button" variant="outline" onClick={generateStudentId}>
                    Generate
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="program">Program</Label>
                <Select
                  value={formData.program}
                  onValueChange={(value) => handleSelectChange("program", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Business Administration">Business Administration</SelectItem>
                    <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                    <SelectItem value="Psychology">Psychology</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="English Literature">English Literature</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select value={formData.year} onValueChange={(value) => handleSelectChange("year", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
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

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g., 123-456-7890"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter full address"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendCredentials"
                checked={formData.sendCredentials}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="sendCredentials" className="text-sm font-normal">
                Send login credentials to student's email
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding Student..." : "Add Student"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
