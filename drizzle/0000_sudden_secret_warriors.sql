CREATE TABLE "admin" (
	"id" serial PRIMARY KEY NOT NULL,
	"admin_id" text NOT NULL,
	"password_hash" text DEFAULT '' NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "admin_admin_id_unique" UNIQUE("admin_id")
);
--> statement-breakpoint
CREATE TABLE "attendance_record" (
	"id" serial PRIMARY KEY NOT NULL,
	"attendance_session_id" integer,
	"student_id" integer,
	"status" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attendance_session" (
	"id" serial PRIMARY KEY NOT NULL,
	"term_id" integer NOT NULL,
	"date" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "class_subject" (
	"id" serial PRIMARY KEY NOT NULL,
	"class_id" integer,
	"subject_id" integer,
	"teacher_id" integer
);
--> statement-breakpoint
CREATE TABLE "class" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"class_teacher_id" integer
);
--> statement-breakpoint
CREATE TABLE "score_setup" (
	"id" serial PRIMARY KEY NOT NULL,
	"class_subject_id" integer,
	"column_name" text NOT NULL,
	"max_score" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "student" (
	"id" serial PRIMARY KEY NOT NULL,
	"admission_no" text NOT NULL,
	"password_hash" text DEFAULT '' NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"middle_name" text,
	"class_id" integer,
	CONSTRAINT "student_admission_no_unique" UNIQUE("admission_no")
);
--> statement-breakpoint
CREATE TABLE "student_score" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"class_subject_id" integer NOT NULL,
	"term_id" integer NOT NULL,
	"score_setup_id" integer NOT NULL,
	"score" integer NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subject" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teacher" (
	"id" serial PRIMARY KEY NOT NULL,
	"staff_id" text NOT NULL,
	"password_hash" text DEFAULT '' NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "teacher_staff_id_unique" UNIQUE("staff_id")
);
--> statement-breakpoint
CREATE TABLE "term" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"session_id" integer
);
--> statement-breakpoint
ALTER TABLE "attendance_record" ADD CONSTRAINT "attendance_record_attendance_session_id_attendance_session_id_fk" FOREIGN KEY ("attendance_session_id") REFERENCES "public"."attendance_session"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_record" ADD CONSTRAINT "attendance_record_student_id_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_session" ADD CONSTRAINT "attendance_session_term_id_term_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."term"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_subject" ADD CONSTRAINT "class_subject_class_id_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."class"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_subject" ADD CONSTRAINT "class_subject_subject_id_subject_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subject"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_subject" ADD CONSTRAINT "class_subject_teacher_id_teacher_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teacher"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class" ADD CONSTRAINT "class_class_teacher_id_teacher_id_fk" FOREIGN KEY ("class_teacher_id") REFERENCES "public"."teacher"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "score_setup" ADD CONSTRAINT "score_setup_class_subject_id_class_subject_id_fk" FOREIGN KEY ("class_subject_id") REFERENCES "public"."class_subject"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_score" ADD CONSTRAINT "student_score_student_id_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_score" ADD CONSTRAINT "student_score_class_subject_id_class_subject_id_fk" FOREIGN KEY ("class_subject_id") REFERENCES "public"."class_subject"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_score" ADD CONSTRAINT "student_score_term_id_term_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."term"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_score" ADD CONSTRAINT "student_score_score_setup_id_score_setup_id_fk" FOREIGN KEY ("score_setup_id") REFERENCES "public"."score_setup"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "term" ADD CONSTRAINT "term_session_id_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."session"("id") ON DELETE no action ON UPDATE no action;