"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, ChevronLeft, Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"

export default function AssignmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { courseId, assignmentId } = params
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [assignment, setAssignment] = useState(null)
  const [submission, setSubmission] = useState({
    text: "",
    files: [],
  })
  const { toast } = useToast()

  useEffect(() => {
    // In a real app, this would fetch the assignment details from an API
    // For demo purposes, we'll use mock data
    setTimeout(() => {
      setAssignment({
        id: assignmentId,
        courseId: courseId,
        courseName: "Introduction to Programming",
        courseCode: "CS101",
        title: "Control Structures Practice",
        description:
          "In this assignment, you will implement various control structures in Java to solve a set of problems. You will practice using if-else statements, switch cases, for loops, while loops, and do-while loops.",
        instructions:
          "1. Create a new Java project named 'ControlStructuresPractice'.\n2. Implement solutions for each of the following problems:\n   - Problem 1: Write a program that determines if a year is a leap year.\n   - Problem 2: Write a program that prints the Fibonacci sequence up to n terms.\n   - Problem 3: Write a program that checks if a number is prime.\n   - Problem 4: Write a program that prints a pattern of stars.\n3. Submit your Java files as a single ZIP archive.\n4. Include a README.txt file explaining how to run your programs.",
        dueDate: "May 15, 2025",
        timeRemaining: "10 days, 5 hours",
        maxPoints: 100,
        status: "pending", // completed, pending, not_started
        submissionType: "file", // file, text, both
        allowResubmission: true,
        maxAttempts: 3,
        attemptsUsed: 0,
        attachments: [
          {
            id: 1,
            name: "Assignment_Guidelines.pdf",
            type: "pdf",
            size: "256 KB",
            url: "#",
          },
        ],
        rubric: [
          {
            criterion: "Correctness",
            description: "All programs work as specified",
            points: 40,
          },
          {
            criterion: "Code Quality",
            description: "Code is well-organized, commented, and follows Java conventions",
            points: 30,
          },
          {
            criterion: "Documentation",
            description: "README file is clear and complete",
            points: 15,
          },
          {
            criterion: "Efficiency",
            description: "Solutions use appropriate algorithms and are efficient",
            points: 15,
          },
        ],
      })
      setIsLoading(false)
    }, 1000)
  }, [assignmentId, courseId])

  const handleTextChange = (e) => {
    setSubmission((prev) => ({ ...prev, text: e.target.value }))
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setSubmission((prev) => ({ ...prev, files }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate submission
    if (assignment.submissionType === "file" && submission.files.length === 0) {
      toast({
        title: "No file selected",
        description: "Please upload a file to submit this assignment.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    if (assignment.submissionType === "text" && !submission.text.trim()) {
      toast({
        title: "No text entered",
        description: "Please enter your submission text.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // In a real app, this would be an API call to submit the assignment
      // For demo purposes, we'll simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Assignment submitted",
        description: "Your assignment has been submitted successfully.",
      })

      // Update the assignment status
      setAssignment((prev) => ({
        ...prev,
        status: "completed",
        attemptsUsed: prev.attemptsUsed + 1,
      }))

      // Clear the submission form
      setSubmission({
        text: "",
        files: [],
      })
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your assignment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="flex h-full items-center justify-center">Loading assignment details...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{assignment.title}</h1>
          <p className="text-gray-500">
            {assignment.courseCode} - {assignment.courseName}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
              <CardDescription>Instructions and requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Description</h3>
                <p className="text-gray-700">{assignment.description}</p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Instructions</h3>
                <div className="whitespace-pre-line text-gray-700">{assignment.instructions}</div>
              </div>
              {assignment.attachments.length > 0 && (
                <div>
                  <h3 className="mb-2 font-semibold">Attachments</h3>
                  <div className="space-y-2">
                    {assignment.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between rounded-md border p-3">
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4 text-gray-500" />
                          <span>{attachment.name}</span>
                          <span className="ml-2 text-xs text-gray-500">{attachment.size}</span>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={attachment.url} download>
                            Download
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submission</CardTitle>
              <CardDescription>
                {assignment.status === "completed"
                  ? "Your submission has been received"
                  : "Submit your assignment here"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assignment.status === "completed" ? (
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Submission successful</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>Your assignment has been submitted successfully. You will be notified when it is graded.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {(assignment.submissionType === "text" || assignment.submissionType === "both") && (
                    <div className="space-y-2">
                      <label htmlFor="submission-text" className="block font-medium">
                        Your Answer
                      </label>
                      <Textarea
                        id="submission-text"
                        placeholder="Type your answer here..."
                        value={submission.text}
                        onChange={handleTextChange}
                        rows={8}
                      />
                    </div>
                  )}

                  {(assignment.submissionType === "file" || assignment.submissionType === "both") && (
                    <div className="space-y-2">
                      <label htmlFor="submission-file" className="block font-medium">
                        Upload Files
                      </label>
                      <div className="rounded-md border border-dashed p-6 text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">Drag and drop your files here, or click to browse</p>
                        <p className="mt-1 text-xs text-gray-500">
                          Supported formats: .zip, .pdf, .doc, .docx, .java, .txt
                        </p>
                        <Input id="submission-file" type="file" className="mt-4" onChange={handleFileChange} multiple />
                        {submission.files.length > 0 && (
                          <div className="mt-4 text-left">
                            <p className="text-sm font-medium">Selected files:</p>
                            <ul className="mt-2 space-y-1 text-sm text-gray-600">
                              {submission.files.map((file, index) => (
                                <li key={index} className="flex items-center">
                                  <FileText className="mr-2 h-4 w-4" />
                                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Assignment"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge
                  variant={
                    assignment.status === "completed"
                      ? "success"
                      : assignment.status === "pending"
                        ? "default"
                        : "outline"
                  }
                >
                  {assignment.status === "completed"
                    ? "Completed"
                    : assignment.status === "pending"
                      ? "Pending"
                      : "Not Started"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Due Date</span>
                <span className="text-sm">
                  <Calendar className="mr-1 inline-block h-3 w-3" />
                  {assignment.dueDate}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Time Remaining</span>
                <span className="text-sm">
                  <Clock className="mr-1 inline-block h-3 w-3" />
                  {assignment.timeRemaining}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Points</span>
                <span className="text-sm">{assignment.maxPoints}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Attempts</span>
                <span className="text-sm">
                  {assignment.attemptsUsed}/{assignment.maxAttempts}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grading Rubric</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignment.rubric.map((item, index) => (
                  <div key={index} className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.criterion}</span>
                      <span className="text-sm">{item.points} pts</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {assignment.status !== "completed" && new Date(assignment.dueDate) < new Date() && (
            <div className="rounded-md bg-amber-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-amber-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">Deadline passed</h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <p>
                      The deadline for this assignment has passed. Late submissions may be subject to penalties as per
                      the course policy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
