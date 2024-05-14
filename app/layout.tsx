import "./globals.css";
import "./data-tables-css.css";
import "./satoshi.css";
import Content from "@/components/Content";
import { auth } from "@/auth";
import { PageContext } from "./context";
import { ISession } from "./type";
import ToastProvider from "@/components/ToastProvider";

export default async function RootLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: {
		session: ISession;
	};
}) {
	const session = (await auth()) as any;

	params.session = session;

	return (
		<html lang='en'>
			<body suppressHydrationWarning={true}>
				<Content params={params}>
					<ToastProvider>{children}</ToastProvider>
				</Content>
			</body>
		</html>
	);
}
