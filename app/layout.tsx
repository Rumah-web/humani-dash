import "./globals.css";
import "./data-tables-css.css";
import "./satoshi.css";
import Content from "@/components/Content";
import { auth } from "@/auth";
import { PageContext } from "./context";
import { ISession } from "./type";

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
				<Content params={params}>{children}</Content>
			</body>
		</html>
	);
}
