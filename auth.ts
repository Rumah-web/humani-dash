import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
// import bcrypt from 'bcrypt';
import * as argon2 from "argon2";
import db from './prisma/lib/db'
import { m_user } from '@prisma/client';

async function getUser(email: string): Promise<m_user | null> {
  try {
    const user = await db.m_user.findUnique({
      where: {
        username: email,
        status: 'active'
      }
    })
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string(), password: z.string().min(6) })
          .safeParse(credentials);


          console.log('parsedCredentials : ', parsedCredentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;

          const passwordsMatch = await argon2.verify(user.password, password);

          console.log('SUCCESS LOGIN : ', user)

          if (passwordsMatch) return user as any
        } 
        
        return null
      },
    })
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
});


// https://nextjs.org/learn/dashboard-app/adding-authentication