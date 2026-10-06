"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"

const teacherSchema = z.object({
  name: z.string().min(1, "Name is required"),
  staffId: z.string().min(1, "Staff ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type TeacherFormValues = z.infer<typeof teacherSchema>

type TeacherFormProps = {
  onSubmit: (data: { name: string; staffId: string; passwordHash: string }) => Promise<{ id: number }[]>
}

export function TeacherForm({ onSubmit }: TeacherFormProps) {
  const router = useRouter()
  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: { name: "", staffId: "", password: "" },
  })

  async function handleSubmit(values: TeacherFormValues) {
    try {
      const bcrypt = await import("bcryptjs")
      const passwordHash = await bcrypt.hash(values.password, 10)
      await onSubmit({ name: values.name, staffId: values.staffId, passwordHash })
      toast.success("Teacher created successfully")
      form.reset()
      router.refresh()
    } catch (err) { console.error(err); toast.error("Failed to create teacher") }
  }

  return (
    <Card className="max-w-lg">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="staffId" render={({ field }) => (
              <FormItem><FormLabel>Staff ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="flex gap-2">
              <Button type="submit">Create Teacher</Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
