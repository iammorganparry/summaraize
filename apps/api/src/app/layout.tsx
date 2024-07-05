import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

import { ClerkProvider } from "@clerk/nextjs";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
	title: "Summaraize",
	description: "Summarize any video and chat with your favourite content",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={GeistSans.className}>
					<TRPCReactProvider>{children}</TRPCReactProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
