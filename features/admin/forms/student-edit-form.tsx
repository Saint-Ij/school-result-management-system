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

const studentEditSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  middleName: z.string().optional(),
  admissionNo: z.string().min(1),
  password: z.string().optional(),
})

type StudentEditFormProps = {
  student: { id: number; firstName: string; lastName: string; middleName: string | null; admissionNo: string }
  onSubmit: (data: { firstName: string; lastName: string; middleName: string | null; admissionNo: string; password?: string }) => Promise<void>
}

export function StudentEditForm({ student, onSubmit }: StudentEditFormProps) {
  const router = useRouter()
  const form = useForm<z.infer<typeof studentEditSchema>>({
    resolver: zodResolver(studentEditSchema),
    defaultValues: { firstName: student.firstName, lastName: student.lastName, middleName: student.middleName ?? "", admissionNo: student.admissionNo },
  })

  async function handleSubmit(values: z.infer<typeof studentEditSchema>) {
    try {
      await onSubmit({ ...values, middleName: values.middleName || null })
      toast.success("Student updated")
      router.push(`/admin/students/${student.id}`)
      router.refresh()
    } catch (err) { console.error(err); toast.error("Failed to update student") }
  }

  return (
    <Card className="max-w-lg">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="lastName" render={({ field }) => (<FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="firstName" render={({ field }) => (<FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <FormField control={form.control} name="middleName" render={({ field }) => (<FormItem><FormLabel>Middle Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="admissionNo" render={({ field }) => (<FormItem><FormLabel>Admission Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="password" render={({ field }) => (<FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="Leave blank to keep current" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <div className="flex gap-2">
              <Button type="submit">Update Student</Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
