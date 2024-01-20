import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = !nextUrl.pathname.startsWith('/auth/signin');
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl));
      }
      return true;
    },
    async signIn(params) {
      return true;
    },
    async session({ session, token }: any) {
      
      if (session.user?.name) session.user.name = token.name;
      if (token.uuid) session.user.uuid = token.uuid

      return session;
    },
    async jwt({ token, user }) {
      
      // * User only available on first run.
      let newUser = { ...user } as any;
      if (newUser.uuid)
        token.uuid = `${newUser.uuid}`;

      return token;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;