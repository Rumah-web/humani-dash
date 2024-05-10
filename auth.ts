import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
// import bcrypt from 'bcrypt';
import * as argon2 from "argon2";
import db from "./prisma/lib/db";
import { m_files, m_roles, m_user, m_user_roles } from "@prisma/client";

async function getUser(email: string): Promise<m_user | null> {
	try {
		let user = null as
			| null
			| (m_user &
					Partial<{
						m_user_roles: Partial<m_user_roles & { m_roles: { name: any } }>[];
						m_files: null | { path: any; uuid: any };
            roles: Array<string>
					}>);

		user = await db.m_user.findUnique({
			include: {
				m_files: {
					select: {
						path: true,
						uuid: true,
					},
				},
				m_user_roles: {
					select: {
						m_roles: {
							select: {
								name: true,
							},
						},
					},
				},
			},
			where: {
				username: email,
				status: "active",
			},
		});

    if(user?.m_user_roles) {
      user = {...user, roles: user.m_user_roles.map((role, i) => {
        return role.m_roles?.name
      })}
    }
		
		return user;
	} catch (error) {
		console.error("Failed to fetch user:", error);
		throw new Error("Failed to fetch user.");
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

				console.log("parsedCredentials : ", parsedCredentials);

				if (parsedCredentials.success) {
					const { email, password } = parsedCredentials.data;
					const user = await getUser(email);
					if (!user) return null;

					const passwordsMatch = await argon2.verify(user.password, password);

					console.log("SUCCESS LOGIN : ", user);

					if (passwordsMatch) return user as any;
				}

				return null;
			},
		}),
	],
	secret: process.env.AUTH_SECRET,
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
		updateAge: 24 * 60 * 60, // 24 hours
	},
});

// https://nextjs.org/learn/dashboard-app/adding-authentication
