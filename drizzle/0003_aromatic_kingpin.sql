ALTER TABLE "attendance_record" DROP CONSTRAINT "attendance_record_attendance_session_id_attendance_session_id_fk";
--> statement-breakpoint
ALTER TABLE "attendance_record" DROP CONSTRAINT "attendance_record_student_id_student_id_fk";
--> statement-breakpoint
ALTER TABLE "attendance_session" DROP CONSTRAINT "attendance_session_term_id_term_id_fk";
--> statement-breakpoint
ALTER TABLE "attendance_session" DROP CONSTRAINT "attendance_session_class_id_class_id_fk";
--> statement-breakpoint
ALTER TABLE "class_subject" DROP CONSTRAINT "class_subject_class_id_class_id_fk";
--> statement-breakpoint
ALTER TABLE "class_subject" DROP CONSTRAINT "class_subject_subject_id_subject_id_fk";
--> statement-breakpoint
ALTER TABLE "class_subject" DROP CONSTRAINT "class_subject_teacher_id_teacher_id_fk";
--> statement-breakpoint
ALTER TABLE "report_card" DROP CONSTRAINT "report_card_student_id_student_id_fk";
--> statement-breakpoint
ALTER TABLE "report_card" DROP CONSTRAINT "report_card_class_id_class_id_fk";
--> statement-breakpoint
ALTER TABLE "report_card" DROP CONSTRAINT "report_card_term_id_term_id_fk";
--> statement-breakpoint
ALTER TABLE "report_card" DROP CONSTRAINT "report_card_approved_by_admin_id_fk";
--> statement-breakpoint
ALTER TABLE "class" DROP CONSTRAINT "class_class_teacher_id_teacher_id_fk";
--> statement-breakpoint
ALTER TABLE "score_setup" DROP CONSTRAINT "score_setup_class_subject_id_class_subject_id_fk";
--> statement-breakpoint
ALTER TABLE "student_class" DROP CONSTRAINT "student_class_student_id_student_id_fk";
--> statement-breakpoint
ALTER TABLE "student_class" DROP CONSTRAINT "student_class_class_id_class_id_fk";
--> statement-breakpoint
ALTER TABLE "student_class" DROP CONSTRAINT "student_class_session_id_session_id_fk";
--> statement-breakpoint
ALTER TABLE "student_score" DROP CONSTRAINT "student_score_student_id_student_id_fk";
--> statement-breakpoint
ALTER TABLE "student_score" DROP CONSTRAINT "student_score_class_subject_id_class_subject_id_fk";
--> statement-breakpoint
ALTER TABLE "student_score" DROP CONSTRAINT "student_score_term_id_term_id_fk";
--> statement-breakpoint
ALTER TABLE "student_score" DROP CONSTRAINT "student_score_score_setup_id_score_setup_id_fk";
--> statement-breakpoint
ALTER TABLE "term" DROP CONSTRAINT "term_session_id_session_id_fk";
--> statement-breakpoint
ALTER TABLE "attendance_record" ADD CONSTRAINT "attendance_record_attendance_session_id_attendance_session_id_fk" FOREIGN KEY ("attendance_session_id") REFERENCES "public"."attendance_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_record" ADD CONSTRAINT "attendance_record_student_id_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_session" ADD CONSTRAINT "attendance_session_term_id_term_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."term"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_session" ADD CONSTRAINT "attendance_session_class_id_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."class"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_subject" ADD CONSTRAINT "class_subject_class_id_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."class"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_subject" ADD CONSTRAINT "class_subject_subject_id_subject_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subject"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_subject" ADD CONSTRAINT "class_subject_teacher_id_teacher_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teacher"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_card" ADD CONSTRAINT "report_card_student_id_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_card" ADD CONSTRAINT "report_card_class_id_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."class"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_card" ADD CONSTRAINT "report_card_term_id_term_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."term"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_card" ADD CONSTRAINT "report_card_approved_by_admin_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."admin"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class" ADD CONSTRAINT "class_class_teacher_id_teacher_id_fk" FOREIGN KEY ("class_teacher_id") REFERENCES "public"."teacher"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "score_setup" ADD CONSTRAINT "score_setup_class_subject_id_class_subject_id_fk" FOREIGN KEY ("class_subject_id") REFERENCES "public"."class_subject"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_class" ADD CONSTRAINT "student_class_student_id_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_class" ADD CONSTRAINT "student_class_class_id_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."class"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_class" ADD CONSTRAINT "student_class_session_id_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_score" ADD CONSTRAINT "student_score_student_id_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_score" ADD CONSTRAINT "student_score_class_subject_id_class_subject_id_fk" FOREIGN KEY ("class_subject_id") REFERENCES "public"."class_subject"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_score" ADD CONSTRAINT "student_score_term_id_term_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."term"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_score" ADD CONSTRAINT "student_score_score_setup_id_score_setup_id_fk" FOREIGN KEY ("score_setup_id") REFERENCES "public"."score_setup"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "term" ADD CONSTRAINT "term_session_id_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."session"("id") ON DELETE cascade ON UPDATE no action;