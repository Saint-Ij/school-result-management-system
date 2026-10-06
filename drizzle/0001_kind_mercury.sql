CREATE TYPE "public"."attendance_status" AS ENUM('present', 'absent', 'excused', 'late');--> statement-breakpoint
CREATE TABLE "student_class" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"class_id" integer NOT NULL,
	"session_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admin" ALTER COLUMN "password_hash" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "attendance_record" ALTER COLUMN "attendance_session_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "attendance_record" ALTER COLUMN "student_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "attendance_record" ALTER COLUMN "status" SET DATA TYPE "public"."attendance_status" USING "status"::"public"."attendance_status";--> statement-breakpoint
ALTER TABLE "class_subject" ALTER COLUMN "class_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "class_subject" ALTER COLUMN "subject_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "score_setup" ALTER COLUMN "class_subject_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "student" ALTER COLUMN "password_hash" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "teacher" ALTER COLUMN "password_hash" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "term" ALTER COLUMN "session_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "attendance_session" ADD COLUMN "class_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "student_class" ADD CONSTRAINT "student_class_student_id_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_class" ADD CONSTRAINT "student_class_class_id_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."class"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_class" ADD CONSTRAINT "student_class_session_id_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."session"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_session" ADD CONSTRAINT "attendance_session_class_id_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."class"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student" DROP COLUMN "class_id";--> statement-breakpoint
ALTER TABLE "student_score" ADD CONSTRAINT "student_score_student_id_score_setup_id_term_id_unique" UNIQUE("student_id","score_setup_id","term_id");