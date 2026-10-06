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

const teacherEditSchema = z.object({
  name: z.string().min(1, "Name is required"),
  staffId: z.string().min(1, "Staff ID is required"),
  password: z.string().optional(),
})

type TeacherEditFormProps = {
  teacher: { id: number; name: string; staffId: string }
  onSubmit: (data: { name: string; staffId: string; password?: string }) => Promise<void>
}

export function TeacherEditForm({ teacher, onSubmit }: TeacherEditFormProps) {
  const router = useRouter()
  const form = useForm<z.infer<typeof teacherEditSchema>>({
    resolver: zodResolver(teacherEditSchema),
    defaultValues: { name: teacher.name, staffId: teacher.staffId },
  })

  async function handleSubmit(values: z.infer<typeof teacherEditSchema>) {
    try {
      await onSubmit(values)
      toast.success("Teacher updated")
      router.push(`/admin/teachers/${teacher.id}`)
      router.refresh()
    } catch (err) { console.error(err); toast.error("Failed to update teacher") }
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
              <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="Leave blank to keep current" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="flex gap-2">
              <Button type="submit">Update Teacher</Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
