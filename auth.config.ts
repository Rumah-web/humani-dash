import type { NextAuthConfig } from "next-auth";

export const authConfig = {
	pages: {
		signIn: "/auth/signin",
	},
	callbacks: {
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user;
			const isOnDashboard = !nextUrl.pathname.startsWith("/auth/signin");

			if (isOnDashboard) {
				if (isLoggedIn) return true;
				return false; // Redirect unauthenticated users to login page
			} else if (isLoggedIn) {
				return Response.redirect(new URL("/", nextUrl));
			}
			return true;
		},
		async signIn(params) {
			return true;
		},
		async session({ session, token }: any) {
			if (session.user?.name) session.user.name = token.name;
			if (token.image) session.user.image = token.image;
			if (token.uuid) session.user.uuid = token.uuid;

			if (token.roles) session.user.roles = token.roles;

			return session;
		},
		async jwt({ token, user }) {
			const assets_api = process.env.API_ASSETS_HOST + "/view";
			// * User only available on first run.
			let newUser = { ...user } as any;

			if (newUser && Object.keys(newUser).length > 0) {
				if (typeof newUser.roles !== "undefined") {
					token.roles = newUser.roles;
				}
			}

			if (newUser.uuid) token.uuid = `${newUser.uuid}`;

			if (newUser.image) token.image = `${assets_api}/${newUser.m_files.uuid}`;

			if (typeof token.roles === "undefined" || !token.roles) {
				return null;
			} else {
				if ((token.roles as any).length === 0) {
					return null;
				}
			}

			return token;
		},
	},
	providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
