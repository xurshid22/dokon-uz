// File: src/app/api/auth/[...nextauth]/route.ts
// (rename this file to [...nextauth]/route.ts in your project)
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
