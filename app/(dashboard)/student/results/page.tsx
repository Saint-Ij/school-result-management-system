import { auth } from "@/auth"
import { PageHeader } from "@/components/shared/page-header"
import { StudentResultsList } from "@/features/student/components/student-results-list"
import { getPublishedResults } from "@/server/student/queries"

export default async function StudentResultsPage() {
  const session = await auth()
  const userId = Number(session?.user?.id)
  const results = await getPublishedResults(userId)

  return (
    <div>
      <PageHeader title="My Results" description="View your approved results" />
      <StudentResultsList results={results} />
    </div>
  )
}
