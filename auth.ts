import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "./lib/db";
import { admin, student, teacher } from "./lib/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type Admin = InferSelectModel<typeof admin>;
export type Teacher = InferSelectModel<typeof teacher>;
export type Student = InferSelectModel<typeof student>;


export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        type: { label: "Type", type: "text" },
      },
      async authorize(credentials) {
        if (
          !credentials?.username ||
          !credentials?.password ||
          !credentials?.type
        )
          return null;

        const { username, password, type } = credentials;
        let user: Admin | Student | Teacher | undefined;

        if (type === "admin") {
          user = await db.query.admin.findFirst({
            where: eq(admin.adminId, username as string),
          });
        } else if (type === "teacher") {
          user = await db.query.teacher.findFirst({
            where: eq(teacher.staffId, username as string),
          });
        } else if (type === "student") {
          user = await db.query.student.findFirst({
            where: eq(student.admissionNo, username as string),
          });
        }

        if (!user) return null;

        const isValid = await bcrypt.compare(password as string, user.passwordHash);
        if (!isValid) return null;

        return {
          id: String(user.id),
          type: type as string,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.type = (user as { type?: string }).type;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const user = session.user as { id?: string; type?: string };
        user.id = token.sub ?? "";
        user.type = token.type as string | undefined;
      }

      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },
});
