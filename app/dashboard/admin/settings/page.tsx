"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Settings, Bell, Shield, Calendar } from "lucide-react"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [generalSettings, setGeneralSettings] = useState({
    institutionName: "",
    institutionLogo: "",
    academicYear: "",
    currentSemester: "",
    websiteUrl: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
  })
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    studentRegistrationNotification: true,
    courseEnrollmentNotification: true,
    gradePostingNotification: true,
    systemMaintenanceNotification: true,
  })
  const [securitySettings, setSecuritySettings] = useState({
    passwordExpiryDays: "90",
    minimumPasswordLength: "8",
    requireSpecialCharacters: true,
    requireNumbers: true,
    requireUppercase: true,
    maxLoginAttempts: "5",
    sessionTimeoutMinutes: "30",
    twoFactorAuth: false,
  })
  const [academicSettings, setAcademicSettings] = useState({
    gradingScale: "letter",
    passingGrade: "D",
    gpaScale: "4.0",
    attendanceRequired: true,
    minimumAttendancePercentage: "75",
    lateSubmissionPolicy: "penalty",
    lateSubmissionPenaltyPerDay: "10",
    maxLateSubmissionDays: "5",
  })
  const { toast } = useToast()

  useEffect(() => {
    // In a real app, this would fetch the settings from an API
    // For demo purposes, we'll use mock data
    setTimeout(() => {
      setGeneralSettings({
        institutionName: "EduManager University",
        institutionLogo: "/logo.png",
        academicYear: "2025-2026",
        currentSemester: "Spring",
        websiteUrl: "https://www.edumanager.edu",
        contactEmail: "info@edumanager.edu",
        contactPhone: "123-456-7890",
        address: "123 University Avenue, Academic City, State 12345",
      })
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleGeneralChange = (e) => {
    const { name, value } = e.target
    setGeneralSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationToggle = (name, checked) => {
    setNotificationSettings((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSecurityChange = (name, value) => {
    setSecuritySettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleAcademicChange = (name, value) => {
    setAcademicSettings((prev) => ({ ...prev, [name]: value }))
  }

  const saveSettings = async (settingsType) => {
    setIsSaving(true)

    try {
      // In a real app, this would be an API call to save the settings
      // For demo purposes, we'll simulate a successful save
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings saved",
        description: `${settingsType} settings have been updated successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "There was an error saving the settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="flex h-full items-center justify-center">Loading settings...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">System Settings</h1>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">
            <Settings className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="academic">
            <Calendar className="mr-2 h-4 w-4" />
            Academic
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic information about your institution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="institutionName">Institution Name</Label>
                  <Input
                    id="institutionName"
                    name="institutionName"
                    value={generalSettings.institutionName}
                    onChange={handleGeneralChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institutionLogo">Institution Logo URL</Label>
                  <Input
                    id="institutionLogo"
                    name="institutionLogo"
                    value={generalSettings.institutionLogo}
                    onChange={handleGeneralChange}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="academicYear">Current Academic Year</Label>
                  <Input
                    id="academicYear"
                    name="academicYear"
                    value={generalSettings.academicYear}
                    onChange={handleGeneralChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentSemester">Current Semester</Label>
                  <Select
                    value={generalSettings.currentSemester}
                    onValueChange={(value) => setGeneralSettings((prev) => ({ ...prev, currentSemester: value }))}
                  >
                    <SelectTrigger id="currentSemester">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fall">Fall</SelectItem>
                      <SelectItem value="Spring">Spring</SelectItem>
                      <SelectItem value="Summer">Summer</SelectItem>
                      <SelectItem value="Winter">Winter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  name="websiteUrl"
                  value={generalSettings.websiteUrl}
                  onChange={handleGeneralChange}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={handleGeneralChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={generalSettings.contactPhone}
                    onChange={handleGeneralChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={generalSettings.address}
                  onChange={handleGeneralChange}
                  rows={3}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={() => saveSettings("General")} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when notifications are sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Send notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationToggle("emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <p className="text-sm text-gray-500">Send notifications via SMS</p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => handleNotificationToggle("smsNotifications", checked)}
                  />
                </div>

                <div className="my-6 border-t pt-6">
                  <h3 className="mb-4 text-sm font-medium">Notification Events</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="studentRegistrationNotification">Student Registration</Label>
                      <Switch
                        id="studentRegistrationNotification"
                        checked={notificationSettings.studentRegistrationNotification}
                        onCheckedChange={(checked) =>
                          handleNotificationToggle("studentRegistrationNotification", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="courseEnrollmentNotification">Course Enrollment</Label>
                      <Switch
                        id="courseEnrollmentNotification"
                        checked={notificationSettings.courseEnrollmentNotification}
                        onCheckedChange={(checked) => handleNotificationToggle("courseEnrollmentNotification", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="gradePostingNotification">Grade Posting</Label>
                      <Switch
                        id="gradePostingNotification"
                        checked={notificationSettings.gradePostingNotification}
                        onCheckedChange={(checked) => handleNotificationToggle("gradePostingNotification", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="systemMaintenanceNotification">System Maintenance</Label>
                      <Switch
                        id="systemMaintenanceNotification"
                        checked={notificationSettings.systemMaintenanceNotification}
                        onCheckedChange={(checked) =>
                          handleNotificationToggle("systemMaintenanceNotification", checked)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => saveSettings("Notification")} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and authentication options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiryDays">Password Expiry (Days)</Label>
                  <Input
                    id="passwordExpiryDays"
                    type="number"
                    min="0"
                    value={securitySettings.passwordExpiryDays}
                    onChange={(e) => handleSecurityChange("passwordExpiryDays", e.target.value)}
                  />
                  <p className="text-xs text-gray-500">0 means passwords never expire</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimumPasswordLength">Minimum Password Length</Label>
                  <Input
                    id="minimumPasswordLength"
                    type="number"
                    min="6"
                    value={securitySettings.minimumPasswordLength}
                    onChange={(e) => handleSecurityChange("minimumPasswordLength", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="requireSpecialCharacters">Require Special Characters</Label>
                  <Switch
                    id="requireSpecialCharacters"
                    checked={securitySettings.requireSpecialCharacters}
                    onCheckedChange={(checked) => handleSecurityChange("requireSpecialCharacters", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="requireNumbers">Require Numbers</Label>
                  <Switch
                    id="requireNumbers"
                    checked={securitySettings.requireNumbers}
                    onCheckedChange={(checked) => handleSecurityChange("requireNumbers", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="requireUppercase">Require Uppercase Letters</Label>
                  <Switch
                    id="requireUppercase"
                    checked={securitySettings.requireUppercase}
                    onCheckedChange={(checked) => handleSecurityChange("requireUppercase", checked)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    min="1"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => handleSecurityChange("maxLoginAttempts", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeoutMinutes">Session Timeout (Minutes)</Label>
                  <Input
                    id="sessionTimeoutMinutes"
                    type="number"
                    min="5"
                    value={securitySettings.sessionTimeoutMinutes}
                    onChange={(e) => handleSecurityChange("sessionTimeoutMinutes", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">Require 2FA for all admin users</p>
                </div>
                <Switch
                  id="twoFactorAuth"
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) => handleSecurityChange("twoFactorAuth", checked)}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={() => saveSettings("Security")} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Academic Settings</CardTitle>
              <CardDescription>Configure grading and academic policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gradingScale">Grading Scale</Label>
                  <Select
                    value={academicSettings.gradingScale}
                    onValueChange={(value) => handleAcademicChange("gradingScale", value)}
                  >
                    <SelectTrigger id="gradingScale">
                      <SelectValue placeholder="Select grading scale" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="letter">Letter Grade (A, B, C, D, F)</SelectItem>
                      <SelectItem value="percentage">Percentage (0-100%)</SelectItem>
                      <SelectItem value="points">Points Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passingGrade">Passing Grade</Label>
                  <Select
                    value={academicSettings.passingGrade}
                    onValueChange={(value) => handleAcademicChange("passingGrade", value)}
                  >
                    <SelectTrigger id="passingGrade">
                      <SelectValue placeholder="Select passing grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A (90-100%)</SelectItem>
                      <SelectItem value="B">B (80-89%)</SelectItem>
                      <SelectItem value="C">C (70-79%)</SelectItem>
                      <SelectItem value="D">D (60-69%)</SelectItem>
                      <SelectItem value="F">F (Below 60%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gpaScale">GPA Scale</Label>
                  <Select
                    value={academicSettings.gpaScale}
                    onValueChange={(value) => handleAcademicChange("gpaScale", value)}
                  >
                    <SelectTrigger id="gpaScale">
                      <SelectValue placeholder="Select GPA scale" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4.0">4.0 Scale</SelectItem>
                      <SelectItem value="5.0">5.0 Scale</SelectItem>
                      <SelectItem value="10.0">10.0 Scale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="attendanceRequired">Attendance Required</Label>
                    <Switch
                      id="attendanceRequired"
                      checked={academicSettings.attendanceRequired}
                      onCheckedChange={(checked) => handleAcademicChange("attendanceRequired", checked)}
                    />
                  </div>
                  {academicSettings.attendanceRequired && (
                    <div className="mt-4">
                      <Label htmlFor="minimumAttendancePercentage">Minimum Attendance (%)</Label>
                      <Input
                        id="minimumAttendancePercentage"
                        type="number"
                        min="0"
                        max="100"
                        value={academicSettings.minimumAttendancePercentage}
                        onChange={(e) => handleAcademicChange("minimumAttendancePercentage", e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="lateSubmissionPolicy">Late Submission Policy</Label>
                  <Select
                    value={academicSettings.lateSubmissionPolicy}
                    onValueChange={(value) => handleAcademicChange("lateSubmissionPolicy", value)}
                  >
                    <SelectTrigger id="lateSubmissionPolicy">
                      <SelectValue placeholder="Select policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no_late">No Late Submissions Allowed</SelectItem>
                      <SelectItem value="penalty">Accept with Penalty</SelectItem>
                      <SelectItem value="instructor">At Instructor's Discretion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {academicSettings.lateSubmissionPolicy === "penalty" && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="lateSubmissionPenaltyPerDay">Penalty Per Day (%)</Label>
                      <Input
                        id="lateSubmissionPenaltyPerDay"
                        type="number"
                        min="0"
                        max="100"
                        value={academicSettings.lateSubmissionPenaltyPerDay}
                        onChange={(e) => handleAcademicChange("lateSubmissionPenaltyPerDay", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxLateSubmissionDays">Maximum Days Late</Label>
                      <Input
                        id="maxLateSubmissionDays"
                        type="number"
                        min="0"
                        value={academicSettings.maxLateSubmissionDays}
                        onChange={(e) => handleAcademicChange("maxLateSubmissionDays", e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={() => saveSettings("Academic")} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
