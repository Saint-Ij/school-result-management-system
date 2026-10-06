import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { Toaster } from "@/components/ui/toast"

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect("/")
  if (!session.user?.type) redirect("/")

  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
