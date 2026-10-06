"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Layers,
  FolderKanban,
  ClipboardCheck,
  FileSpreadsheet,
  Trophy,
  Menu,
  X,
  LogOut,
  Key,
  Sun,
  Moon,
  ArrowUp,
  FileText,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react"
import { ChangePasswordDialog } from "@/features/shared/components/change-password-dialog"

type NavItem = {
  label: string
  href: string
  icon: LucideIcon
}

type DashboardLayoutProps = {
  children: React.ReactNode
  role: "admin" | "teacher" | "student"
  name: string
}

const roleNav: Record<string, NavItem[]> = {
  admin: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Teachers", href: "/admin/teachers", icon: Users },
    { label: "Students", href: "/admin/students", icon: GraduationCap },
    { label: "Sessions", href: "/admin/sessions", icon: Calendar },
    { label: "Terms", href: "/admin/terms", icon: Layers },
    { label: "Classes", href: "/admin/classes", icon: BookOpen },
    { label: "Subjects", href: "/admin/subjects", icon: FolderKanban },
    { label: "Assignments", href: "/admin/assignments", icon: ClipboardCheck },
    { label: "Score Setup", href: "/admin/score-setup", icon: FileSpreadsheet },
    { label: "Promotion", href: "/admin/promotion", icon: ArrowUp },
    { label: "Results", href: "/admin/results", icon: Trophy },
    { label: "Applications", href: "/admin/applications", icon: FileText },
    { label: "Password Reset", href: "/admin/password-reset", icon: Key },
  ],
  teacher: [
    { label: "Dashboard", href: "/teacher", icon: LayoutDashboard },
    { label: "Attendance", href: "/teacher/attendance", icon: Calendar },
    { label: "Scores", href: "/teacher/scores", icon: FileSpreadsheet },
    { label: "Score Sheet", href: "/teacher/score-sheet", icon: ClipboardCheck },
    { label: "Results", href: "/teacher/results", icon: Trophy },
  ],
  student: [
    { label: "Dashboard", href: "/student", icon: LayoutDashboard },
    { label: "Results", href: "/student/results", icon: Trophy },
  ],
}

export function DashboardLayout({ children, role, name }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true"
    }
    return false
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("darkMode", darkMode.toString())
  }, [darkMode])

  const navItems = roleNav[role] || []

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <Link href={`/${role}`} className="text-sm font-semibold tracking-wider uppercase">
            {role === "admin" ? "Admin Panel" : role === "teacher" ? "Teacher Portal" : "Student Portal"}
          </Link>
          <Button
            variant="ghost"
            size="icon-xs"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="size-4" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="size-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-border p-3">
          <div className="mb-2 px-3 py-2 text-xs text-muted-foreground">
            {name}
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {darkMode ? <Sun className="size-4 shrink-0" /> : <Moon className="size-4 shrink-0" />}
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <ChangePasswordDialog>
            <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <Key className="size-4 shrink-0" />
              <span>Change Password</span>
            </button>
          </ChangePasswordDialog>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="size-4 shrink-0" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background px-4 lg:px-8">
          <Button
            variant="ghost"
            size="icon-xs"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-4" />
          </Button>
          <div className="flex-1" />
          <span className="text-xs text-muted-foreground">{name}</span>
        </header>
        <main className="flex-1 p-4 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
