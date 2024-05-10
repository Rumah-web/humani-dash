import 'server-only';
import type { Adapter, AdapterUser } from '@auth/core/adapters';
import { Awaitable } from '@auth/core/types';

import db from "./prisma/lib/db";

type AuthAdapter = {
  // Create type for createSession
  createUser: (
    // eslint-disable-next-line no-unused-vars
    data: Pick<AdapterUser,  'email'>,
  ) => Awaitable<AdapterUser>;
} & Omit<Adapter, 'createUser'>;

export function authAdapter(): AuthAdapter {
    const prisma = db
  return {
    async createSession(data) {
      // Collect IP and UserAgent information here.
      console.log('create :', data)
      const createSessionResponse = await prisma.session.create({
        data: {
          sessionToken: data.sessionToken,
          user_id: data.userId,
          expires: data.expires,
        },
      });

      return {
        expires: createSessionResponse.expires,
        sessionToken: createSessionResponse.sessionToken,
        userId: createSessionResponse.user_id,
      };
    },
    async createUser(data: any) {
      const userData = {
        username: data.username,
        email: data.email,
        password: null,
      } as any

      const newUser = await prisma.m_user.create({
        data: userData,
      });

      return newUser as any;
    },
    async deleteSession(token) {
      const session = await prisma.session.delete({ where: { sessionToken: token } });

      return {
        expires: session.expires,
        sessionToken: session.sessionToken,
        userId: session.user_id,
      };
    },
    async getSessionAndUser(token) {
      const userAndSession = await prisma.session.findUnique({
        where: { sessionToken: token },
        include: { m_user: true },
      });

      if (!userAndSession) return null;

      const { m_user, ...session } = userAndSession;

      return {
        user: m_user,
        session: {
          expires: session.expires,
          sessionToken: session.sessionToken,
          userId: session.user_id,
        },
      } as any;
    },
    async getUserByAccount(oAuthProvider) {
      const { provider, providerAccountId } = oAuthProvider;

      // We'll only ever use Google or Apple, so we can just check for those.

      return null;
    },
    async updateSession(data) {
      const session = await prisma.session.update({
        where: { sessionToken: data.sessionToken },
        data: { sessionToken: data.sessionToken, expires: data.expires },
      });

      return {
        expires: session.expires,
        sessionToken: session.sessionToken,
        userId: session.user_id,
      };
    },
    deleteUser: (id) => prisma.m_user.delete({ where: { uuid: id } }) as any,
    getUser: (id) => prisma.m_user.findUnique({ where: { uuid: id } }) as any,
    getUserByEmail: (email) => prisma.m_user.findUnique({ where: { email } }) as any,
    linkAccount: async (data) => {

      return null;
    },
    updateUser: ({ id, ...data }: any) => prisma.m_user.update({ where: { uuid:id }, data }) as any,
  };
}