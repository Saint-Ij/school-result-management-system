# GSAI EduPortal — Admin Training Manual

> **Version**: 1.0  
> **Audience**: School Administrators  
> **Purpose**: Guide to setting up and operating the school management portal

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Initial School Setup](#2-initial-school-setup)
3. [Creating Teachers](#3-creating-teachers)
4. [Creating Students](#4-creating-students)
5. [Assignments Hub](#5-assignments-hub)
6. [Score Setup](#6-score-setup)
7. [Promotion](#7-promotion)
8. [Teacher Operations](#8-teacher-operations)
9. [Result Approval Workflow](#9-result-approval-workflow)
10. [Password Reset](#10-password-reset)
11. [Report Cards](#11-report-cards)
12. [Quick Reference](#12-quick-reference)

---

## 1. Getting Started

### Logging In

1. Open the school portal URL in your browser.
2. Click the **"I'm an Admin"** button on the login page.
3. Enter your credentials:
   - **Username**: `admin`
   - **Password**: `123456`
4. Click **Login**.

> **First time?** Change your password immediately via the **Password Reset** page (see section 9).

### Dashboard Overview

After logging in, you'll see the **Admin Dashboard** with:

- **Stats Cards** at the top showing: Total Students, Total Teachers, Total Classes, Total Subjects, the active session name, and the number of pending results awaiting approval.
- **Students Per Class chart** — a bar chart showing enrollment distribution.
- **Result Approval Statistics** — a pie chart showing how many results are Approved, Pending, or in Draft.

Use the **sidebar navigation** on the left to access all features. The sidebar is organised by workflow order:

```
Dashboard
Teachers
Students
Sessions
Terms
Classes
Subjects
Assignments
Score Setup
Results
Password Reset
```

---

## 2. Initial School Setup

> **Recommended order**: Sessions → Terms → Classes → Subjects

### 2.1 Sessions

Sessions represent academic years (e.g., "2024/2025").

1. Go to **Sessions** in the sidebar.
2. Click the **Create Session** button.
3. Enter the session name (e.g., `2024/2025`) and click **Create**.
4. Repeat for `2025/2026`.
5. **Set one session as Active** by clicking the **"Set Active"** button next to it. Only one session can be active at a time, and students can only be enrolled in the active session.

### 2.2 Terms

Each session has three terms.

1. Go to **Terms** in the sidebar.
2. Select a session from the dropdown.
3. Enter a term name (e.g., `1st Term`) and set the **Next Term Begins** date (the date the following term starts).
4. Click **Add**. Repeat for 2nd Term and 3rd Term.
5. To **edit a date** later, click the **"Edit"** link next to any term and pick a new date.
6. To **delete a term**, click the trash icon.

### 2.3 Classes

Create the classes in your school (e.g., JSS 1–3, SSS 1–3).

1. Go to **Classes** in the sidebar.
2. Type a class name (e.g., `JSS 1`) and click **Create**.
3. Repeat for all classes (`JSS 2`, `JSS 3`, `SSS 1`, `SSS 2`, `SSS 3`).
4. Optionally **assign a class teacher** from the edit modal (see section 3 first if you need to create teachers).

### 2.4 Subjects

Create all subjects offered in your school.

1. Go to **Subjects** in the sidebar.
2. Type a subject name (e.g., `Mathematics`) and click **Create**.
3. Repeat for all subjects. Example set:
   - Junior (JSS): English Studies, Mathematics, Basic Science, Basic Technology, Social Studies, Civic Education, Agricultural Science, Home Economics, Computer Studies, Physical Education, CRS/IRS, French.
   - Senior (SSS): English Language, Mathematics, Physics, Chemistry, Biology, Further Mathematics, Economics, Government, Literature, Commerce, Accountancy, Agricultural Science, Computer Science, Geography, Civic Education, CRS/IRS.
4. Use the **edit** (pencil) or **delete** (trash) icons to modify subjects later.

---

## 3. Creating Teachers

1. Go to **Teachers** in the sidebar.
2. Click **"Add Teacher"** at the top.
3. Fill in the form:
   - **Name**: Teacher's full name (e.g., `Adebayo Okafor`).
   - **Staff ID**: A unique identifier (e.g., `TCH/001`). This is the teacher's login username.
   - **Password**: Temporary password (e.g., `123456`). The teacher can request a password change later.
4. Click **Create**.
5. The teacher can now log in using the **Teacher** login option with their Staff ID and password.

### Teacher Details

- Click a teacher's **View** (eye) icon to see which classes they are homeroom teacher for and which subjects they teach.
- Use **Edit** (pencil) to update their name or Staff ID.
- Use **Delete** (trash) to remove a teacher (this will unassign them from any classes or subjects).

---

## 4. Creating Students

### Creating One Student

1. Go to **Students** in the sidebar.
2. Click **"Add Student"** at the top.
3. Fill in:
   - **Last Name** and **First Name** (required).
   - **Middle Name** (optional).
   - **Admission Number**: A unique identifier (e.g., `GSAI/001`). This is the student's login username.
   - **Password**: Temporary password (e.g., `123456`).
4. Click **Create**.

### Bulk Import

Currently, students must be added one at a time or via the seed script (contact technical support).

### After Creation

- Students are **not yet enrolled in a class**. You must enroll them via the **Assignments** page (see section 5.2).
- Students log in using the **Student** login option with their Admission Number and password.

---

## 5. Assignments Hub

This is the central page for linking everything together. Go to **Assignments** in the sidebar — it has three tabs.

### 5.1 Assign Subjects to Classes

Before students can receive scores, subjects must be assigned to each class.

1. Select the **"Subjects to Classes"** tab.
2. Use the search to find and select a class (e.g., "JSS 1").
3. A list of all subjects appears. **Check the box** next to each subject that class should study.
4. Click **"Assign Selected Subjects"**.
5. The right panel shows currently assigned subjects. Click the **×** to remove one.

> Repeat for every class. JSS subjects go to JSS 1–3, SSS subjects to SSS 1–3.

### 5.2 Enroll Students in Classes

Students must be enrolled in a class for the active session before they can appear on score sheets or attendance lists.

1. Select the **"Students to Classes"** tab.
2. Choose a **Session** (usually the active one).
3. Search and select a **Class**.
4. The left panel shows **available students** (not yet enrolled in this class). Check the box next to each student you want to enroll.
5. Click **"Assign Selected Students"**.
6. The right panel shows **enrolled students**. Click **×** to remove a student from the class.

> **Note**: A student can only be enrolled in one class per session. If a student is already enrolled elsewhere, it will be indicated.

### 5.3 Assign Teachers to Subjects

Teachers must be assigned to each class-subject combination so they can enter scores and take attendance.

1. Select the **"Teachers to Subjects"** tab.
2. Search and select a class-subject (e.g., "JSS 1 - Mathematics").
3. The current teacher (if any) is shown.
4. Search and select a teacher from the list.
5. Click **"Assign Teacher"**.
6. The **Current Assignments** section below shows all teacher-subject-class links. Click **×** to unassign.

> Repeat for every class-subject in your school. Remember: a teacher can be assigned different subjects in different classes.

---

## 6. Score Setup

This defines the score columns (e.g., CA, Exam) for each class-subject and their maximum scores.

1. Go to **Score Setup** in the sidebar.
2. Search and select a **class-subject** (e.g., "JSS 1 - Mathematics").
3. Under **"Add Column"**, enter:
   - **Column Name**: e.g., `CA` (Continuous Assessment) or `Exam`.
   - **Max Score**: e.g., `40` for CA, `60` for Exam.
   - Click **Add Column**.
4. Add all columns for that subject. Example: `CA (40)` + `Exam (60)`.
5. Use the **edit** (pencil) icon to modify a column's name or max score later.
6. Use the **delete** (trash) icon to remove a column.

> **Important**: This must be done for EVERY class-subject before teachers can enter scores. Total of all max scores should typically equal 100.

### Quick Setup with Seed Script

If you have many subjects, you can run the provided seed script from the command line to set up standard columns across all class-subjects:

```bash
node scripts/seed-scores.js
```

This adds **CA1 (20)** + **CA2 (20)** + **Exam (60)** to every class-subject.

---

## 7. Promotion

Promote students from one class to the next at the end of a term/session.

1. Go to **Promotion** in the sidebar.
2. **Select Sessions** — Choose the *From Session* (current enrollments) and *To Session* (new enrollments). They must be different.
3. **Promotion Overview** — A card lists every class with enrolled students in the from-session.
   - Classes with a detectable name progression (e.g., JSS 1 → JSS 2) show the suggested next class as a badge.
   - Terminal classes (e.g., SSS 3) show a *Manual pick* badge — no automatic suggestion.
4. Click **Select Students** next to a class to expand it and see the student list.
5. Check individual students or use **Select All**.
6. Pick the **Target Class** from the dropdown (always manual, never auto-filled).
7. Click **Promote N Students** to enroll the selected students in the target class under the to-session.
8. Existing enrollments are preserved (old records remain as history).

> **Note**: The system does not unenroll students from the old class. Promotion only adds new enrollment records.

---

## 8. Teacher Operations

Teachers handle the following through their own dashboard. This section explains what happens so you can assist them.

### 7.1 Attendance

1. Teacher selects a **class + term + date**.
2. Loads the student list.
3. Marks each student as **Present**, **Absent**, **Excused**, or **Late**.
4. Clicks **Save Attendance**.

Attendance data appears on student report cards and dashboards.

### 7.2 Score Entry

1. Teacher selects a **class-subject + term**.
2. The score columns (set up in Score Setup) are displayed as column headers.
3. Teacher enters a numeric score for each student in each column.
4. Clicks **Save Scores**.

Scores feed into the results system and report cards.

### 7.3 Score Sheet & Results

1. Teacher can view a **consolidated score sheet** for any class+term showing all subjects, grand totals, averages, and positions.
2. Can **export as CSV** for offline analysis.
3. For **results submission**: Teacher selects a student, views a summary of their scores across all subjects, enters a **class teacher comment**, and clicks **"Submit for Approval"**.

---

## 9. Result Approval Workflow

This is the administrative validation step. Results must be approved before students can view their report cards.

### Reviewing Pending Results

1. Go to **Results** in the sidebar.
2. The **"Pending"** tab shows all teacher-submitted results awaiting your review.
3. Click **"View"** on any result to open the approval dialog.

### The Approval Dialog

You'll see:
- **Student scores**: Each subject with its component scores, totals, and max values.
- **Summary**: Total score, average percentage, overall grade, position in class, and total students.
- **Teacher comment**: The class teacher's remark.

### Actions

| Action | What Happens |
|--------|-------------|
| **Approve** | Enter an optional admin/head teacher comment, then click Approve. The result status becomes **Approved**, and the student can view their report card. |
| **Reject** | The result returns to **Draft** status. The teacher can revise and resubmit. |

### Approved Results

The **"Approved"** tab lists all previously approved results for reference.

---

## 10. Password Reset

Any user (admin, teacher, or student) can have their password reset.

1. Go to **Password Reset** in the sidebar.
2. Select the **user type** (Admin, Teacher, or Student).
3. Search for the user by name or ID.
4. Select the user from the results.
5. Enter and confirm the new password (minimum 6 characters).
6. Click **Reset Password**.

> Share the new password securely with the user.

---

## 11. Report Cards

When a result is **Approved**, the student can access their report card from their dashboard.

### Student View

1. Student logs in and goes to **Results**.
2. Clicks **"View Report Card"** on any approved term.
3. The report card is a print-friendly document showing:
   - **School Header**: Logo, name, address, motto.
   - **Student Info**: Name, class, admission number, term, session, next term begins date, class teacher.
   - **Subject Scores Table**: Each subject with component scores, total (scaled to 100), grade, and remark.
   - **Grading Key**: Score ranges with grades and remarks.
   - **Performance Chart**: Bar chart of subject percentages.
   - **Performance Summary**: Total score, average, overall grade, position, attendance.
   - **Comments**: Class teacher and head teacher remarks.

4. Buttons:
   - **Print**: Opens the browser print dialog.
   - **Export**: Downloads an HTML file that can be opened and printed later.

---

## 12. Quick Reference

### Login Credentials

| Role | Username Field | Default Password |
|------|---------------|-----------------|
| Admin | `admin` | `123456` |
| Teacher | Staff ID (e.g., `TCH/001`) | `123456` |
| Student | Admission No (e.g., `JSS1/0001`) | `123456` |

### Navigation — Sidebar Order

| Menu | Purpose |
|------|---------|
| Dashboard | Overview stats and charts |
| Teachers | CRUD for teacher accounts |
| Students | CRUD for student accounts |
| Sessions | Academic year management |
| Terms | Term creation with next-term-begins dates |
| Classes | Class creation and class teacher assignment |
| Subjects | Subject creation |
| Assignments | Link subjects→classes, students→classes, teachers→subjects |
| Score Setup | Define score columns and max scores per subject |
| Promotion | Promote students to next class at session end |
| Results | Approve or reject submitted results |
| Password Reset | Reset passwords for any user |

### Recommended Setup Sequence

```
Sessions -> Terms -> Classes -> Subjects
     -> Create Teachers -> Create Students
     -> Assign Subjects to Classes
     -> Assign Teachers to Subjects
     -> Enroll Students in Classes
     -> Configure Score Setup per Subject
     -> Teachers Enter Scores
     -> Teachers Submit Results
     -> Admin Approves Results
     -> Students View Report Cards
```

### Key Rules

- Students must be enrolled in a class **per session** before they appear on score/attendance lists.
- Score columns must be configured **for each class-subject** before scores can be entered.
- Results must be **approved by admin** before students can view report cards.
- Only the **active session** accepts new enrollments.
- A student can only be enrolled in **one class per session**.
