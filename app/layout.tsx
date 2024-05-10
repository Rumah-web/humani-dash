import "./globals.css";
import "./data-tables-css.css";
import "./satoshi.css";
import Content from "@/components/Content";
import { auth } from "@/auth";

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
  const session = await auth()
	return (
		<html lang='en'>
			<body suppressHydrationWarning={true}>
				<Content session={session}>{children}</Content>
			</body>
		</html>
	);
}
