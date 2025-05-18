"use client"

import { useState, FormEvent, ChangeEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { api, tokenUtils, LoginData } from "@/lib/api"

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Call the API to authenticate
      const response = await api.auth.login(formData)
      
      // User data and token are automatically stored by the API client
      const userData = tokenUtils.getUserData()
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData?.name || formData.email}!`,
      })

      // Redirect based on role
      const role = userData?.role?.toLowerCase() || ""
      if (role === "admin") {
        router.push("/dashboard/admin")
      } else if (role === "teacher") {
        router.push("/dashboard/teacher")
      } else {
        router.push("/dashboard/student")
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register here
            </Link>
          </div>
          <Link href="/" className="text-sm text-gray-500 hover:underline">
            Back to home
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}