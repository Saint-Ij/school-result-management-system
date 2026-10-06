"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopup,
  SelectItem,
} from "@/components/ui/select"
import { toast } from "sonner"

type AdminPasswordResetProps = {
  admins: { id: number; adminId: string; name: string }[]
  teachers: { id: number; staffId: string; name: string }[]
  students: { id: number; admissionNo: string; firstName: string; lastName: string }[]
  onReset: (userType: "admin" | "teacher" | "student", userId: number, newPassword: string) => Promise<{ success: true } | { error: string }>
}

export function AdminPasswordReset({ admins, teachers, students, onReset }: AdminPasswordResetProps) {
  const router = useRouter()
  const [userType, setUserType] = useState("")
  const [selectedUserId, setSelectedUserId] = useState("")
  const [userSearch, setUserSearch] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  function getUsers() {
    if (userType === "admin") return admins.map((a) => ({ id: a.id, label: `${a.name} (${a.adminId})` }))
    if (userType === "teacher") return teachers.map((t) => ({ id: t.id, label: `${t.name} (${t.staffId})` }))
    if (userType === "student") return students.map((s) => ({ id: s.id, label: `${s.firstName} ${s.lastName} (${s.admissionNo})` }))
    return []
  }
  const users = getUsers()
  const filteredUsers = users.filter((u) => u.label.toLowerCase().includes(userSearch.toLowerCase()))

  async function handleReset() {
    if (!userType || !selectedUserId || !newPassword) return
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }
    setLoading(true)
    try {
      const result = await onReset(userType as "admin" | "teacher" | "student", Number(selectedUserId), newPassword)
      if ("error" in result) {
        toast.error(result.error)
      } else {
        toast.success("Password reset successfully")
        setNewPassword("")
        setConfirmPassword("")
        router.refresh()
      }
    } catch (err) {
      console.error(err); toast.error("Failed to reset password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Reset User Password</CardTitle>
        <CardDescription>Select a user and set a new password</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>User Type</Label>
          <Select value={userType} onValueChange={(v) => { setUserType(v ?? ""); setSelectedUserId("") }}>
            <SelectTrigger>
              <SelectValue placeholder="Select user type..." />
            </SelectTrigger>
            <SelectPopup>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="student">Student</SelectItem>
            </SelectPopup>
          </Select>
        </div>

        {userType && (
          <div className="space-y-2">
            <Label>User</Label>
            <div>
              <input
                type="text"
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="mb-1 w-full rounded-none border border-transparent border-b-input bg-transparent px-0 py-1 text-sm outline-none focus-visible:border-b-ring"
              />
              <Select value={selectedUserId} onValueChange={(v) => setSelectedUserId(v ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user...">
                    {(value) => filteredUsers.find((u) => u.id.toString() === value)?.label ?? value}
                  </SelectValue>
                </SelectTrigger>
                <SelectPopup>
                  {filteredUsers.map((u) => (
                    <SelectItem key={u.id} value={u.id.toString()}>
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectPopup>
              </Select>
            </div>
          </div>
        )}

        {selectedUserId && (
          <>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 chars)"
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
              />
            </div>
            <Button onClick={handleReset} disabled={loading || !newPassword} className="w-full">
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
