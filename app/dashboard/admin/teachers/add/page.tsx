"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { api, handleApiError } from "@/lib/api"

export default function AddTeacherPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    teacherId: "",
    department: "",
    password: "", // This will be required according to TeacherRegistrationRequest
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

  const validateForm = () => {
    if (!formData.firstName.trim()) return "First name is required"
    if (!formData.lastName.trim()) return "Last name is required"
    if (!formData.email.trim()) return "Email is required"
    if (!formData.email.includes("@")) return "Email must be valid"
    if (!formData.teacherId.trim()) return "Teacher ID is required"
    if (!formData.teacherId.match(/^T\d{4,}$/)) return "Teacher ID must start with 'T' followed by at least 4 digits"
    if (!formData.department) return "Department is required"
    if (!formData.password || formData.password.length < 6) return "Password must be at least 6 characters"
    return ""
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setError("")
    setIsSubmitting(true)

    try {
      const response = await api.protected.fetchWithAuth("/teachers", {
        method: "POST",
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          teacherId: formData.teacherId,
          department: formData.department,
          password: formData.password,
        }),
      })

      if (response.success) {
        toast({
          title: "Teacher added successfully",
          description: `${formData.firstName} ${formData.lastName} has been added to the system.`,
        })
        router.push("/dashboard/admin/teachers")
      } else {
        throw new Error(response.message || "Failed to add teacher")
      }
    } catch (error) {
      console.error("Error adding teacher:", error)
      const errorMessage = error.message || "Failed to add teacher. Please try again."
      setError(errorMessage)
      toast({
        title: "Error adding teacher",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Add New Teacher</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Teacher Registration</CardTitle>
            <CardDescription>Enter the required teacher information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
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
                <Label htmlFor="lastName">
                  Last Name <span className="text-red-500">*</span>
                </Label>
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
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="teacher@example.com"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="teacherId">
                      Teacher ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="teacherId"
                      name="teacherId"
                      value={formData.teacherId}
                      onChange={handleChange}
                      required
                      placeholder="e.g., T1234"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="department">
                  Department <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleSelectChange("department", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Psychology">Psychology</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding Teacher..." : "Add Teacher"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
