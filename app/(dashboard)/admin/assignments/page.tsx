import { PageHeader } from "@/components/shared/page-header"
import { AssignSubjectsToClasses } from "@/features/admin/components/assign-subjects"
import { AssignStudentsToClasses } from "@/features/admin/components/assign-students"
import { AssignTeachersToSubjects } from "@/features/admin/components/assign-teachers"
import { getClasses, getSubjects, getTeachers, getStudents, getSessions, getClassSubjects, getSessionEnrollments } from "@/server/admin/queries"
import { assignSubjectsToClass, removeSubjectFromClass, assignStudentsToClass, assignTeacherToClassSubject, removeStudentFromClass, removeTeacherFromClassSubject } from "@/server/admin/relations"
import { getClassStudents } from "@/server/teacher/queries"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default async function AssignmentsPage() {
  const [classes, subjects, teachers, students, sessions, classSubjects] = await Promise.all([
    getClasses(), getSubjects(), getTeachers(), getStudents(), getSessions(), getClassSubjects(),
  ])

  async function handleAssignSubjects(classId: number, subjectIds: number[]) {
    "use server"
    await assignSubjectsToClass(classId, subjectIds)
  }

  async function handleRemoveSubject(csId: number) {
    "use server"
    await removeSubjectFromClass(csId)
  }

  async function handleAssignStudents(studentIds: number[], classId: number, sessionId: number) {
    "use server"
    await assignStudentsToClass(studentIds, classId, sessionId)
  }

  async function handleRemoveStudent(studentId: number, classId: number, sessionId: number) {
    "use server"
    await removeStudentFromClass(studentId, classId, sessionId)
  }

  async function handleGetEnrolledStudents(classId: number, sessionId: number) {
    "use server"
    return getClassStudents(classId, sessionId)
  }

  async function handleGetSessionEnrollments(sessionId: number) {
    "use server"
    return getSessionEnrollments(sessionId)
  }

  async function handleAssignTeacher(csId: number, teacherId: number) {
    "use server"
    await assignTeacherToClassSubject(csId, teacherId)
  }

  async function handleRemoveTeacher(csId: number) {
    "use server"
    await removeTeacherFromClassSubject(csId)
  }

  return (
    <div>
      <PageHeader title="Assignments" description="Manage assignments" />
      <Tabs defaultValue="subjects">
        <TabsList>
          <TabsTrigger value="subjects">Subjects to Classes</TabsTrigger>
          <TabsTrigger value="students">Students to Classes</TabsTrigger>
          <TabsTrigger value="teachers">Teachers to Subjects</TabsTrigger>
        </TabsList>
        <TabsContent value="subjects">
          <AssignSubjectsToClasses classes={classes} subjects={subjects} classSubjects={classSubjects} onAssignSubjects={handleAssignSubjects} onRemoveSubject={handleRemoveSubject} />
        </TabsContent>
        <TabsContent value="students">
          <AssignStudentsToClasses classes={classes} students={students} sessions={sessions} onAssignStudents={handleAssignStudents} onRemoveStudent={handleRemoveStudent} onGetEnrolledStudents={handleGetEnrolledStudents} onGetSessionEnrollments={handleGetSessionEnrollments} />
        </TabsContent>
        <TabsContent value="teachers">
          <AssignTeachersToSubjects classSubjects={classSubjects} teachers={teachers} onAssignTeacher={handleAssignTeacher} onRemoveTeacher={handleRemoveTeacher} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
