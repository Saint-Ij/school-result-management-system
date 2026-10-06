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

const studentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  middleName: z.string().optional(),
  admissionNo: z.string().min(1, "Admission number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type StudentFormProps = {
  onSubmit: (data: { admissionNo: string; passwordHash: string; firstName: string; lastName: string; middleName?: string }) => Promise<{ id: number }[]>
}

export function StudentForm({ onSubmit }: StudentFormProps) {
  const router = useRouter()
  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: { firstName: "", lastName: "", middleName: "", admissionNo: "", password: "" },
  })

  async function handleSubmit(values: z.infer<typeof studentSchema>) {
    try {
      const bcrypt = await import("bcryptjs")
      const passwordHash = await bcrypt.hash(values.password, 10)
      await onSubmit({
        firstName: values.firstName,
        lastName: values.lastName,
        middleName: values.middleName || undefined,
        admissionNo: values.admissionNo,
        passwordHash,
      })
      toast.success("Student created successfully")
      form.reset()
      router.refresh()
    } catch (err) { console.error(err); toast.error("Failed to create student") }
  }

  return (
    <Card className="max-w-lg">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="lastName" render={({ field }) => (
                <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="firstName" render={({ field }) => (
                <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="middleName" render={({ field }) => (
              <FormItem><FormLabel>Middle Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="admissionNo" render={({ field }) => (
              <FormItem><FormLabel>Admission Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="flex gap-2">
              <Button type="submit">Create Student</Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
