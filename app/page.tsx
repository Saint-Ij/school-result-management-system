import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, GraduationCap, ShieldCheck, School } from "lucide-react";
import Link from "next/link";

export default function LoginGatewayPage() {
  const roles = [
    {
      title: "Admin",
      path: "/login/admin",
      icon: ShieldCheck,
      desc: "System management access",
      gradient: "from-violet-500 to-purple-600",
      shadow: "hover:shadow-violet-200/50",
    },
    {
      title: "Teacher",
      path: "/login/teacher",
      icon: UserCircle,
      desc: "Classroom and results portal",
      gradient: "from-blue-500 to-sky-600",
      shadow: "hover:shadow-blue-200/50",
    },
    {
      title: "Student",
      path: "/login/student",
      icon: GraduationCap,
      desc: "View results and attendance",
      gradient: "from-emerald-500 to-teal-600",
      shadow: "hover:shadow-emerald-200/50",
    },
  ];

  return (
    <main className="relative min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-amber-100/30 via-transparent to-transparent pointer-events-none" />

      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-md">
            <School className="size-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
           GSAI EduPortal
          </span>
        </div>
        <p className="hidden text-sm text-slate-500 sm:block">
          Academic Management System
        </p>
      </header>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="mb-10 text-center max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-medium text-indigo-700">
            <span className="size-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Academic Year {new Date().getFullYear()}/{new Date().getFullYear() + 1}
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl font-heading">
            Welcome to{" "}
            <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              GSAI Portal
            </span>
          </h1>
          <p className="mt-4 text-base text-slate-600 sm:text-lg max-w-xl mx-auto leading-relaxed">
            Your comprehensive school management platform. Access results,
            manage attendance, and track academic performance seamlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 w-full max-w-3xl sm:grid-cols-3">
          {roles.map((role) => (
            <Link
              href={role.path}
              key={role.title}
              className="group relative"
            >
              <Card
                className={`relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm transition-all duration-300 cursor-pointer
                  shadow-md hover:shadow-xl ${role.shadow}
                  hover:-translate-y-1`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />
                <div className="absolute top-0 right-0 size-24 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-slate-100 to-transparent opacity-50" />

                <CardHeader className="text-center relative z-10 pt-8 pb-6">
                  <div
                    className={`mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br ${role.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                  >
                    <role.icon className="size-7 text-white" />
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-800">
                    {role.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-500">
                    {role.desc}
                  </CardDescription>
                </CardHeader>

                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${role.gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                />
              </Card>
            </Link>
          ))}
        </div>

        <p className="mt-12 text-xs text-slate-400 text-center max-w-md">
          Authorized personnel only. By accessing this portal you agree to the
          terms and conditions of Gifted Scholars Academy and Islamiyya.
        </p>
      </div>

      <footer className="relative z-10 border-t border-slate-200/60 px-6 py-4 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} Gifted Scholars Academy and Islamiyya. All rights
        reserved.
      </footer>
    </main>
  );
}
