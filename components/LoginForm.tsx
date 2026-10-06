"use client";

import { useActionState, useEffect } from "react";
import { loginAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Loader2 } from "lucide-react";

const initialState = {
  error: "",
  success: false,
};

export default function LoginForm({
  type,
}: {
  type: "admin" | "teacher" | "student";
}) {
  const [state, action, isPending] = useActionState(loginAction, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push(`/${type}`);
    }
  }, [state, router, type]);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="type" value={type} />

      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm font-medium text-slate-700">
          {type === "student" ? "Admission Number" : "Staff ID"}
        </Label>
        <Input
          id="username"
          name="username"
          placeholder={type === "student" ? "Enter admission number" : "Enter ID"}
          required
          className="h-11 rounded-xl border-slate-200 bg-slate-50/50 px-4 text-sm transition-colors focus-visible:bg-white focus-visible:border-indigo-300"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-slate-700">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter password"
          required
          className="h-11 rounded-xl border-slate-200 bg-slate-50/50 px-4 text-sm transition-colors focus-visible:bg-white focus-visible:border-indigo-300"
        />
      </div>

      {state?.error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-sm font-medium text-red-600">{state.error}</p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md shadow-indigo-200/50 transition-all duration-200 font-medium"
        disabled={isPending}
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Authenticating...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <LogIn className="size-4" />
            Sign In
          </span>
        )}
      </Button>
    </form>
  );
}
