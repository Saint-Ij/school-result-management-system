"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"

const schema = z.object({ name: z.string().min(1, "Session name is required") })

type CreateSessionFormProps = {
  onCreate: (name: string) => Promise<void>
}

export function CreateSessionForm({ onCreate }: CreateSessionFormProps) {
  const router = useRouter()
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { name: "" } })

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      await onCreate(values.name)
      toast.success("Session created")
      router.refresh()
      form.reset()
    } catch (err) { console.error(err); toast.error("Failed to create session") }
  }

  return (
    <Card>
      <CardHeader><CardTitle>Create Session</CardTitle></CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Session Name</FormLabel><FormControl><Input placeholder="e.g. 2024/2025" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <Button type="submit">Create Session</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
