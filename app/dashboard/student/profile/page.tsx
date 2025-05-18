"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { api, tokenUtils } from "@/lib/api" // Import the API utilities

export default function StudentProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentId: "",
    program: "",
    year: "",
    phone: "",
    address: "",
    dateOfBirth: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Fetch the student's profile data from the API
    const fetchProfile = async () => {
      try {
        // Get the current user's ID from the token
        const userData = tokenUtils.getUserData();
        if (!userData || !userData.id) {
          toast({
            title: "Authentication error",
            description: "Please log in again to view your profile.",
            variant: "destructive",
          })
          router.push('/login');
          return;
        }

        // Fetch the student's profile using the ID
        const response = await api.protected.fetchWithAuth(`/students/${userData.id}`);
        
        if (response.success) {
          const student = response.data;
          // Split the name into first and last name (assuming format is "First Last")
          const nameParts = student.name.split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          setProfileData({
            firstName,
            lastName,
            email: student.email || '',
            studentId: student.studentId || '',
            program: student.program || '',
            year: student.year || '',
            // The following fields aren't in the API response, keeping them empty or defaults
            phone: profileData.phone || '',
            address: profileData.address || '',
            dateOfBirth: profileData.dateOfBirth || '',
          });
        } else {
          throw new Error(response.message || "Failed to fetch profile");
        }
      } catch (error) {
        toast({
          title: "Failed to load profile",
          description: error.message || "There was an error loading your profile. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Get the current user's ID from the token
      const userData = tokenUtils.getUserData();
      if (!userData || !userData.id) {
        throw new Error("User ID not found");
      }

      // Prepare the update data
      const updateData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        name: `${profileData.firstName} ${profileData.lastName}`,
        email: profileData.email,
        studentId: profileData.studentId,
        program: profileData.program,
        year: profileData.year,
        // Any other fields needed by your API
      };

      // Update the student profile
      const response = await api.protected.fetchWithAuth(`/students/${userData.id}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      });

      if (response.success) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
      } else {
        throw new Error(response.message || "Failed to update profile");
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <div className="flex h-full items-center justify-center">Loading profile...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" value={profileData.firstName} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" value={profileData.lastName} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleChange}
                  required
                  disabled
                />
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  name="studentId"
                  value={profileData.studentId}
                  onChange={handleChange}
                  required
                  disabled
                />
                <p className="text-xs text-gray-500">Student ID cannot be changed</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="program">Program</Label>
                <Select
                  value={profileData.program}
                  onValueChange={(value) => handleSelectChange("program", value)}
                  disabled
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
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Contact administration to change program</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select value={profileData.year} onValueChange={(value) => handleSelectChange("year", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st Year">1st Year</SelectItem>
                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                    <SelectItem value="4th Year">4th Year</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
{/* 
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" value={profileData.phone} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" value={profileData.address} onChange={handleChange} />
            </div> */}

            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}