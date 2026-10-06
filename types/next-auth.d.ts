import "next-auth"

declare module "next-auth" {
  interface User {
    type?: string
  }
  interface Session {
    user: {
      id: string
      type?: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    type?: string
  }
}
