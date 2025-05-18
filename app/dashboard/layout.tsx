"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, BookOpen, Calendar, Settings, LogOut, Menu, X } from "lucide-react"

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("userData")
    console.log("Stored user data:", storedUser)
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userData")
    localStorage.removeItem("token")
    router.push("/login")
  }

  // Determine which navigation items to show based on user role
  const getNavItems = () => {
    const commonItems = [
      { href: `/dashboard/${user?.role.toLowerCase()}`, label: "Dashboard", icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
     
    ]

    if (user?.role === "ADMIN") {
      return [
        ...commonItems,
        { href: "/dashboard/admin/students", label: "Students", icon: <Users className="mr-2 h-4 w-4" /> },
        { href: "/dashboard/admin/teachers", label: "Teachers", icon: <Users className="mr-2 h-4 w-4" /> },
        { href: "/dashboard/admin/courses", label: "Courses", icon: <BookOpen className="mr-2 h-4 w-4" /> },
        { href: "/dashboard/admin/settings", label: "Settings", icon: <Settings className="mr-2 h-4 w-4" /> },
      ]
    } else if (user?.role === "TEACHER") {
      return [
        ...commonItems,
         { href: `/dashboard/teacher/profile`, label: "Profile", icon: <Users className="mr-2 h-4 w-4" /> },
        { href: "/dashboard/teacher/courses", label: "My Courses", icon: <BookOpen className="mr-2 h-4 w-4" /> },
        // { href: "/dashboard/teacher/students", label: "My Students", icon: <Users className="mr-2 h-4 w-4" /> },
        { href: "/dashboard/teacher/calendar", label: "Calendar", icon: <Calendar className="mr-2 h-4 w-4" /> },
        
      ]
    } else {
      return [
        ...commonItems,
         { href: `/dashboard/student/profile`, label: "Profile", icon: <Users className="mr-2 h-4 w-4" /> },
        { href: "/dashboard/student/courses", label: "My Courses", icon: <BookOpen className="mr-2 h-4 w-4" /> },
        { href: "/dashboard/student/calendar", label: "Calendar", icon: <Calendar className="mr-2 h-4 w-4" /> },
      ]
    }
  }

  if (!user) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 md:flex-row">
      {/* Mobile Header */}
      <div className="flex items-center justify-between bg-white p-4 shadow md:hidden">
        <h1 className="text-xl font-bold">EduManager</h1>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${isMobileMenuOpen ? "block" : "hidden"} w-full bg-white shadow md:block md:w-64 md:flex-shrink-0`}
      >
        <div className="flex h-full flex-col">
          <div className="hidden items-center justify-center border-b p-4 md:flex">
            <h1 className="text-xl font-bold">EduManager</h1>
          </div>
          <div className="flex flex-col space-y-1 p-4">
            <div className="mb-4 rounded-lg bg-gray-100 p-4">
              <p className="text-sm font-medium text-gray-500">Logged in as:</p>
              <p className="font-medium capitalize">{user.role}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <nav className="space-y-1">
              {getNavItems().map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant={pathname === item.href ? "default" : "ghost"} className={`w-full justify-start ${pathname === item.href ? "" : "hover:bg-black/40"}`}>
                    {item.icon}
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  )
}
