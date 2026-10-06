import {
  pgTable,
  serial,
  uuid,
  text,
  varchar,
  timestamp,
  date,
  integer,
  boolean,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";

export const attendanceStatusEnum = pgEnum("attendance_status", [
  "present",
  "absent",
  "excused",
  "late",
]);

export const admin = pgTable("admin", {
  id: serial("id").primaryKey(),
  adminId: text("admin_id").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
});

export const teacher = pgTable("teacher", {
  id: serial("id").primaryKey(),
  staffId: text("staff_id").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
});

export const student = pgTable("student", {
  id: serial("id").primaryKey(),
  admissionNo: text("admission_no").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  middleName: text("middle_name"),
});

export const session = pgTable("session", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  isActive: boolean("is_active").default(false),
});

export const term = pgTable("term", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sessionId: integer("session_id")
    .references(() => session.id, { onDelete: "cascade" })
    .notNull(),
  nextTermBegins: date("next_term_begins"),
});

export const schoolClass = pgTable("class", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  classTeacherId: integer("class_teacher_id").references(() => teacher.id, {
    onDelete: "set null",
  }),
});

export const subject = pgTable("subject", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const classSubject = pgTable("class_subject", {
  id: serial("id").primaryKey(),
  classId: integer("class_id")
    .references(() => schoolClass.id, { onDelete: "cascade" })
    .notNull(),
  subjectId: integer("subject_id")
    .references(() => subject.id, { onDelete: "cascade" })
    .notNull(),
  teacherId: integer("teacher_id").references(() => teacher.id, {
    onDelete: "set null",
  }),
});

export const scoreSetup = pgTable("score_setup", {
  id: serial("id").primaryKey(),
  classSubjectId: integer("class_subject_id")
    .references(() => classSubject.id, { onDelete: "cascade" })
    .notNull(),
  columnName: text("column_name").notNull(),
  maxScore: integer("max_score").notNull(),
});

export const studentScore = pgTable(
  "student_score",
  {
    id: serial("id").primaryKey(),
    studentId: integer("student_id")
      .references(() => student.id, { onDelete: "cascade" })
      .notNull(),
    classSubjectId: integer("class_subject_id")
      .references(() => classSubject.id, { onDelete: "cascade" })
      .notNull(),
    termId: integer("term_id")
      .references(() => term.id, { onDelete: "cascade" })
      .notNull(),
    scoreSetupId: integer("score_setup_id")
      .references(() => scoreSetup.id, { onDelete: "cascade" })
      .notNull(),
    score: integer("score").notNull(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [unique().on(table.studentId, table.scoreSetupId, table.termId)]
);

export const attendanceSession = pgTable("attendance_session", {
  id: serial("id").primaryKey(),
  termId: integer("term_id")
    .references(() => term.id, { onDelete: "cascade" })
    .notNull(),
  classId: integer("class_id")
    .references(() => schoolClass.id, { onDelete: "cascade" })
    .notNull(),
  date: date("date").defaultNow().notNull(),
});

export const attendanceRecord = pgTable("attendance_record", {
  id: serial("id").primaryKey(),
  attendanceSessionId: integer("attendance_session_id")
    .references(() => attendanceSession.id, { onDelete: "cascade" })
    .notNull(),
  studentId: integer("student_id")
    .references(() => student.id, { onDelete: "cascade" })
    .notNull(),
  status: attendanceStatusEnum("status").notNull(),
});

export const studentClass = pgTable(
  "student_class",
  {
    id: serial("id").primaryKey(),
    studentId: integer("student_id")
      .references(() => student.id, { onDelete: "cascade" })
      .notNull(),
    classId: integer("class_id")
      .references(() => schoolClass.id, { onDelete: "cascade" })
      .notNull(),
    sessionId: integer("session_id")
      .references(() => session.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [unique().on(table.studentId, table.sessionId)]
);

export const genderEnum = pgEnum("gender", ["male", "female"]);

export const relationshipEnum = pgEnum("relationship", [
  "father",
  "mother",
  "guardian",
  "other",
]);

export const applicationStatusEnum = pgEnum("application_status", [
  "pending",
  "accepted",
  "rejected",
]);

export const applications = pgTable("applications", {
  id: uuid("id").defaultRandom().primaryKey(),

  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  middleName: varchar("middle_name", { length: 100 }),

  gender: genderEnum("gender").notNull(),

  dateOfBirth: date("date_of_birth").notNull(),

  nationality: varchar("nationality", { length: 100 }).notNull(),

  stateOfOrigin: varchar("state_of_origin", {
    length: 100,
  }).notNull(),

  localGovernmentArea: varchar("local_government_area", {
    length: 100,
  }).notNull(),

  parentFullName: varchar("parent_full_name", {
    length: 200,
  }).notNull(),

  relationship: relationshipEnum("relationship").notNull(),

  occupation: varchar("occupation", {
    length: 150,
  }).notNull(),

  email: varchar("email", {
    length: 255,
  }).notNull(),

  phoneNumber: varchar("phone_number", {
    length: 30,
  }).notNull(),

  alternativePhoneNumber: varchar("alternative_phone_number", {
    length: 30,
  }),

  residentialAddress: text("residential_address").notNull(),

  classApplyingFor: varchar("class_applying_for", {
    length: 50,
  }).notNull(),

  programType: varchar("program_type", {
    length: 50,
  }).notNull(),

  previousSchoolAttended: varchar("previous_school_attended", {
    length: 255,
  }),

  lastClassCompleted: varchar("last_class_completed", {
    length: 100,
  }),

  reasonForTransfer: text("reason_for_transfer"),

  bloodGroup: varchar("blood_group", {
    length: 10,
  }),

  genotype: varchar("genotype", {
    length: 10,
  }),

  medicalConditions: text("medical_conditions"),

  disabilities: text("disabilities"),

  passportPhotographUrl: text("passport_photograph_url").notNull(),

  birthCertificateUrl: text("birth_certificate_url").notNull(),

  reportCardUrl: text("report_card_url"),

  medicalCertificateUrl: text("medical_certificate_url"),

  status: applicationStatusEnum("status").default("pending").notNull(),

  reviewedBy: uuid("reviewed_by"),

  reviewNotes: text("review_notes"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const resultStatusEnum = pgEnum("result_status", [
  "draft",
  "teacher_submitted",
  "approved",
]);

export const reportCard = pgTable(
  "report_card",
  {
    id: serial("id").primaryKey(),

    studentId: integer("student_id")
      .references(() => student.id, { onDelete: "cascade" })
      .notNull(),

    classId: integer("class_id")
      .references(() => schoolClass.id, { onDelete: "cascade" })
      .notNull(),

    termId: integer("term_id")
      .references(() => term.id, { onDelete: "cascade" })
      .notNull(),

    classTeacherComment: text("class_teacher_comment"),

    adminComment: text("admin_comment"),

    status: resultStatusEnum("status").default("draft").notNull(),

    approvedBy: integer("approved_by").references(() => admin.id, {
      onDelete: "set null",
    }),

    approvedAt: timestamp("approved_at"),
  },
  (table) => [unique().on(table.studentId, table.classId, table.termId)]
);
