"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Building, User } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { api, tokenUtils } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function TeacherProfilePage() {
  const [teacher, setTeacher] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    teacherId: "",
    department: "",
    password: ""
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      try {
        const userData = tokenUtils.getUserData()
        if (!userData || !userData.id) {
          toast({
            title: "Authentication error",
            description: "Please log in again to view your profile.",
            variant: "destructive",
          })
          return
        }

        const response = await api.protected.fetchWithAuth(`/teachers/${userData.id}`)
        
        if (response.success && response.data) {
          setTeacher(response.data)
          
          // Split the name into first name and last name
          const nameParts = response.data.name.split(" ")
          const firstName = nameParts[0]
          const lastName = nameParts.slice(1).join(" ")
          
          setFormData({
            firstName,
            lastName,
            email: response.data.email,
            teacherId: response.data.teacherId,
            department: response.data.department,
            password: ""
          })
        } else {
          toast({
            title: "Error fetching profile",
            description: "Could not retrieve your profile information.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching teacher profile:", error)
        toast({
          title: "Error",
          description: "Failed to load your profile. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeacherProfile()
  }, [toast])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Only include password if it was provided
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        teacherId: formData.teacherId,
        department: formData.department
      }
      
      // Add password only if it's not empty
      if (formData.password) {
        updateData.password = formData.password
      }
      
      const response = await api.protected.fetchWithAuth(`/teachers/${teacher.id}`, {
        method: "PUT",
        body: JSON.stringify(updateData)
      })
      
      if (response.success) {
        setTeacher({
          ...teacher,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          teacherId: formData.teacherId,
          department: formData.department
        })
        
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        })
        
        setIsEditing(false)
      } else {
        toast({
          title: "Update failed",
          description: response.message || "Failed to update profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update failed",
        description: "An error occurred while updating your profile.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div className="flex h-full items-center justify-center">Loading profile...</div>
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Profile</h1>
        {!isEditing && <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarFallback>
                {teacher.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-xl font-bold">{teacher.name}</h2>
              <p className="text-muted-foreground">{teacher.department}</p>
              <p className="text-sm text-muted-foreground">Teacher ID: {teacher.teacherId}</p>
            </div>
            <div className="w-full space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{teacher.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{teacher.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Role: {teacher.role}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          {isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Label htmlFor="teacherId">Teacher ID</Label>
                      <Input
                        id="teacherId"
                        name="teacherId"
                        value={formData.teacherId}
                        onChange={handleChange}
                        required
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">New Password (optional)</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Leave blank to keep current password"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </CardFooter>
              </form>
            </Card>
          ) : (
            <Tabs defaultValue="about">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="account">Account Info</TabsTrigger>
              </TabsList>
              <TabsContent value="about">
                <Card>
                  <CardHeader>
                    <CardTitle>About Me</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Professor in the {teacher.department} department with a focus on 
                      teaching excellence and student success. Currently teaching at the 
                      School of Management Systems.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{teacher.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{teacher.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Teacher ID</p>
                        <p className="font-medium">{teacher.teacherId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Department</p>
                        <p className="font-medium">{teacher.department}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Account Status</p>
                        <p className="font-medium">{teacher.status}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Account Created</p>
                        <p className="font-medium">{new Date(teacher.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  )
}