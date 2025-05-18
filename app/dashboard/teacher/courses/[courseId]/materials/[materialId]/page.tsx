"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Download, BookOpen, Clock, Calendar, CheckCircle } from "lucide-react"

export default function CourseMaterialPage() {
  const params = useParams()
  const router = useRouter()
  const { courseId, materialId } = params
  const [isLoading, setIsLoading] = useState(true)
  const [material, setMaterial] = useState(null)

  useEffect(() => {
    // In a real app, this would fetch the material details from an API
    // For demo purposes, we'll use mock data
    setTimeout(() => {
      setMaterial({
        id: materialId,
        courseId: courseId,
        courseName: "Introduction to Programming",
        courseCode: "CS101",
        title: "Variables and Data Types",
        type: "lecture", // lecture, video, document
        description: "Understanding different data types in Java",
        content: `
# Variables and Data Types in Java

## Introduction

In Java, variables are containers for storing data values. Java is a statically-typed language, which means that all variables must be declared before they can be used.

## Variable Declaration

The syntax for declaring a variable in Java is:

\`\`\`java
dataType variableName = value;
\`\`\`

For example:

\`\`\`java
int age = 25;
double salary = 50000.50;
char grade = 'A';
boolean isStudent = true;
String name = "John Doe";
\`\`\`

## Primitive Data Types

Java has eight primitive data types:

1. **byte**: 8-bit signed integer (-128 to 127)
2. **short**: 16-bit signed integer (-32,768 to 32,767)
3. **int**: 32-bit signed integer (-2^31 to 2^31-1)
4. **long**: 64-bit signed integer (-2^63 to 2^63-1)
5. **float**: 32-bit floating point
6. **double**: 64-bit floating point
7. **boolean**: true or false
8. **char**: 16-bit Unicode character

## Reference Data Types

Reference data types are created using defined constructors of the classes. They are used to access objects. Some examples include:

- **String**: Represents a sequence of characters
- **Array**: Represents a collection of similar type elements
- **Class**: User-defined blueprint from which objects are created
- **Interface**: Similar to a class but with abstract methods

## Type Conversion

Java supports two types of conversion:

1. **Implicit Conversion (Widening)**: Automatically done when converting a smaller data type to a larger data type.

\`\`\`java
int myInt = 100;
double myDouble = myInt; // Automatic casting: int to double
\`\`\`

2. **Explicit Conversion (Narrowing)**: Manually done when converting a larger data type to a smaller data type.

\`\`\`java
double myDouble = 9.78;
int myInt = (int) myDouble; // Manual casting: double to int
\`\`\`

## Constants

Constants are variables whose values cannot be changed once assigned. In Java, constants are declared using the \`final\` keyword.

\`\`\`java
final double PI = 3.14159;
\`\`\`

## Conclusion

Understanding variables and data types is fundamental to programming in Java. They form the building blocks for storing and manipulating data in your programs.
        `,
        datePublished: "April 15, 2025",
        lastUpdated: "April 20, 2025",
        readTime: "10 minutes",
        attachments: [
          {
            id: 1,
            name: "Java_Data_Types_Cheat_Sheet.pdf",
            type: "pdf",
            size: "420 KB",
            url: "#",
          },
          {
            id: 2,
            name: "Variables_Examples.java",
            type: "java",
            size: "2 KB",
            url: "#",
          },
        ],
        relatedMaterials: [
          {
            id: 1,
            title: "Introduction to Programming Concepts",
            type: "lecture",
          },
          {
            id: 2,
            title: "Working with Operators",
            type: "lecture",
          },
        ],
        completed: false,
      })
      setIsLoading(false)
    }, 1000)
  }, [materialId, courseId])

  const markAsCompleted = () => {
    setMaterial((prev) => ({ ...prev, completed: true }))
  }

  if (isLoading) {
    return <div className="flex h-full items-center justify-center">Loading material...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{material.title}</h1>
            <p className="text-gray-500">
              {material.courseCode} - {material.courseName}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {material.completed ? (
            <Badge variant="success">
              <CheckCircle className="mr-1 h-3 w-3" /> Completed
            </Badge>
          ) : (
            <Button onClick={markAsCompleted}>Mark as Completed</Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Lecture Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: material.content.replace(/\n/g, "<br />") }} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Material Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Type</span>
                <Badge variant="outline">
                  <BookOpen className="mr-1 h-3 w-3" />
                  {material.type.charAt(0).toUpperCase() + material.type.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Published</span>
                <span className="text-sm">
                  <Calendar className="mr-1 inline-block h-3 w-3" />
                  {material.datePublished}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Updated</span>
                <span className="text-sm">
                  <Calendar className="mr-1 inline-block h-3 w-3" />
                  {material.lastUpdated}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Read Time</span>
                <span className="text-sm">
                  <Clock className="mr-1 inline-block h-3 w-3" />
                  {material.readTime}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {material.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4 text-gray-500" />
                      <div>
                        <div className="font-medium">{attachment.name}</div>
                        <div className="text-xs text-gray-500">{attachment.size}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={attachment.url} download>
                        <Download className="mr-1 h-3 w-3" /> Download
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {material.relatedMaterials.map((related) => (
                  <div key={related.id} className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <BookOpen className="mr-2 h-4 w-4 text-gray-500" />
                        <span className="font-medium">{related.title}</span>
                      </div>
                      <Badge variant="outline">{related.type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
