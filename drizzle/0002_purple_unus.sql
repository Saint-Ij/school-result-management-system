CREATE TYPE "public"."result_status" AS ENUM('draft', 'teacher_submitted', 'approved');--> statement-breakpoint
CREATE TABLE "report_card" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"class_id" integer NOT NULL,
	"term_id" integer NOT NULL,
	"class_teacher_comment" text,
	"admin_comment" text,
	"status" "result_status" DEFAULT 'draft' NOT NULL,
	"approved_by" integer,
	"approved_at" timestamp,
	CONSTRAINT "report_card_student_id_class_id_term_id_unique" UNIQUE("student_id","class_id","term_id")
);
--> statement-breakpoint
ALTER TABLE "report_card" ADD CONSTRAINT "report_card_student_id_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_card" ADD CONSTRAINT "report_card_class_id_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."class"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_card" ADD CONSTRAINT "report_card_term_id_term_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."term"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_card" ADD CONSTRAINT "report_card_approved_by_admin_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."admin"("id") ON DELETE no action ON UPDATE no action;