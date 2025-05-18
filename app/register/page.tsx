"use client"

import { useState, ChangeEvent, FormEvent, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { api, RegisterStudentData, RegisterTeacherData } from "@/lib/api"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Check, X } from "lucide-react"

// Define the form data interface
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  studentId: string;
  program: string;
  year: string;
  teacherId: string;
  department: string;
  specialization: string;
}

type RoleType = "student" | "teacher";

export default function RegisterPage() {
  // Role selection state
  const [selectedRole, setSelectedRole] = useState<RoleType>("student")

  // Combined form data for all roles
  const [formData, setFormData] = useState<FormData>({
    // Common fields
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    
    // Student specific fields
    studentId: "S",
    program: "",
    year: new Date().getFullYear().toString(),
    
    // Teacher specific fields
    teacherId: "T",
    department: "",
    specialization: ""
  })

  // Password validation states
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null)
  const [passwordIsValid, setPasswordIsValid] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Check password validity
  useEffect(() => {
    if (formData.password) {
      setPasswordIsValid(formData.password.length >= 6)
    } else {
      setPasswordIsValid(null)
    }

    if (formData.confirmPassword) {
      setPasswordsMatch(formData.password === formData.confirmPassword)
    } else {
      setPasswordsMatch(null)
    }
  }, [formData.password, formData.confirmPassword])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Special handling for IDs to keep the prefix
    if (name === "studentId" && !value.startsWith("S")) {
      setFormData((prev) => ({ ...prev, [name]: `S${value}` }))
    } else if (name === "teacherId" && !value.startsWith("T")) {
      setFormData((prev) => ({ ...prev, [name]: `T${value}` }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleRoleChange = (value: RoleType) => {
    setSelectedRole(value)
  }

  const validateForm = (): boolean => {
    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return false
    }

    if (selectedRole === "student" && formData.studentId.length <= 1) {
      toast({
        title: "Invalid Student ID",
        description: "Please enter a valid student ID.",
        variant: "destructive",
      })
      return false
    }

    if (selectedRole === "teacher" && formData.teacherId.length <= 1) {
      toast({
        title: "Invalid Teacher ID",
        description: "Please enter a valid teacher ID.",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Create role-specific registration data
      const baseData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      }

      // Add role-specific fields and call the appropriate API
      if (selectedRole === "student") {
        const studentData: RegisterStudentData = {
          ...baseData,
          studentId: formData.studentId,
          program: formData.program,
          year: formData.year
        }
        await api.auth.registerStudent(studentData)
      } 
      else if (selectedRole === "teacher") {
        const teacherData: RegisterTeacherData = {
          ...baseData,
          teacherId: formData.teacherId,
          department: formData.department,
          specialization: formData.specialization
        }
        await api.auth.registerTeacher(teacherData)
      }
      
      toast({
        title: "Registration successful",
        description: `Your ${selectedRole} account has been created. You can now login.`,
      })
      
      router.push("/login")
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "There was an error creating your account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription className="text-muted-foreground">
            Register to access the student management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <Label className="block mb-3 font-medium">I am a:</Label>
              <RadioGroup 
                defaultValue="student" 
                value={selectedRole}
                onValueChange={handleRoleChange}
                className="flex justify-center space-x-6"
              >
                <div className="flex flex-col items-center space-y-2 bg-white p-4 rounded-lg border transition-all hover:border-primary">
                  <RadioGroupItem value="student" id="student" className="mb-1" />
                  <Label htmlFor="student" className="font-medium">Student</Label>
                </div>
                <div className="flex flex-col items-center space-y-2 bg-white p-4 rounded-lg border transition-all hover:border-primary">
                  <RadioGroupItem value="teacher" id="teacher" className="mb-1" />
                  <Label htmlFor="teacher" className="font-medium">Teacher</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Common Personal Information Fields */}
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    name="firstName" 
                    placeholder="John"
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
                    placeholder="Doe"
                    value={formData.lastName} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Role Specific Fields */}
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {selectedRole === "student" ? "Student Information" : "Teacher Information"}
              </h3>

              {selectedRole === "student" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input
                      id="studentId"
                      name="studentId"
                      placeholder="S12345"
                      value={formData.studentId}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="program">Program</Label>
                      <Input
                        id="program"
                        name="program"
                        placeholder="Computer Science"
                        value={formData.program}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        name="year"
                        placeholder="2025"
                        value={formData.year}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {selectedRole === "teacher" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="teacherId">Teacher ID</Label>
                    <Input
                      id="teacherId"
                      name="teacherId"
                      placeholder="T12345"
                      value={formData.teacherId}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        name="department"
                        placeholder="Computer Science"
                        value={formData.department}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        name="specialization"
                        placeholder="Machine Learning"
                        value={formData.specialization}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Account Credentials */}
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Account Credentials</h3>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  {passwordIsValid !== null && (
                    <div className="flex items-center space-x-1 text-xs">
                      {passwordIsValid ? (
                        <>
                          <Check className="h-3 w-3 text-green-500" />
                          <span className="text-green-500">Valid password</span>
                        </>
                      ) : (
                        <>
                          <X className="h-3 w-3 text-red-500" />
                          <span className="text-red-500">Minimum 6 characters</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={passwordIsValid === false ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  {passwordsMatch !== null && (
                    <div className="flex items-center space-x-1 text-xs">
                      {passwordsMatch ? (
                        <>
                          <Check className="h-3 w-3 text-green-500" />
                          <span className="text-green-500">Passwords match</span>
                        </>
                      ) : (
                        <>
                          <X className="h-3 w-3 text-red-500" />
                          <span className="text-red-500">Passwords don't match</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={passwordsMatch === false ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </span>
              ) : (
                `Register as ${selectedRole === "student" ? "Student" : "Teacher"}`
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center border-t pt-4">
          <div className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Login here
            </Link>
          </div>
          <Link href="/" className="text-xs text-gray-500 hover:underline">
            Back to home
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}