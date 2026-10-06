"use server";

import { AuthError } from "next-auth";
import { signIn } from "../../auth";

export type LoginState = {
  error: string
  success: boolean
}

export async function loginAction(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const type = formData.get("type") as string;

  try {
    await signIn("credentials", {
      username,
      password,
      type,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid credentials.", success: false };
    }
  }
  return {error: "", success: true}
}
