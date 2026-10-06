import { School } from "lucide-react";
import LoginForm from "@/components/LoginForm";
import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-100/40 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-100/30 via-transparent to-transparent pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 shadow-md">
              <School className="size-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-violet-700 to-purple-700 bg-clip-text text-transparent">
              {process.env.NEXT_PUBLIC_SCHOOL_NAME ?? 'School'} EduPortal
            </span>
          </Link>
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
            <School className="size-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Portal</h1>
          <p className="mt-1 text-sm text-slate-500">System management access</p>
        </div>

        <div className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm p-8 shadow-xl">
          <LoginForm type="admin" />
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-600 transition-colors">
            &larr; Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
