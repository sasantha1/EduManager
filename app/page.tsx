import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">EduManager</h1>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">Student Management System</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
            A comprehensive platform for educational institutions to manage students, teachers, and administrative tasks
            efficiently.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/login">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Admin Portal</CardTitle>
              <CardDescription>Manage the entire institution</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600">
                Complete control over user management, course assignments, and system settings.
              </p>
              <ul className="mb-4 list-inside list-disc text-gray-600">
                <li>Manage teachers and students</li>
                <li>Create and assign courses</li>
                <li>Generate reports</li>
                <li>System configuration</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Teacher Dashboard</CardTitle>
              <CardDescription>Manage courses and students</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600">
                Tools for teachers to manage their courses, track student progress, and communicate effectively.
              </p>
              <ul className="mb-4 list-inside list-disc text-gray-600">
                <li>Course management</li>
                <li>Student attendance</li>
                <li>Grade management</li>
                <li>Communication tools</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Student Portal</CardTitle>
              <CardDescription>Access courses and track progress</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-600">
                Students can view their courses, check grades, and manage their profile information.
              </p>
              <ul className="mb-4 list-inside list-disc text-gray-600">
                <li>Course enrollment</li>
                <li>Grade viewing</li>
                <li>Profile management</li>
                <li>Communication with teachers</li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="bg-gray-800 py-8 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p>&copy; 2025 EduManager. All rights reserved.</p>
            <div className="mt-4 flex space-x-4 md:mt-0">
              <Link href="/terms" className="hover:underline">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
              <Link href="/contact" className="hover:underline">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
