import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseAppId = process.env.NEXT_PUBLIC_BASE_APP_ID ?? "replace-with-your-base-app-id";

export const metadata: Metadata = {
  title: "Base Tiny Poll",
  description: "Onchain micro poll mini app on Base.",
  other: {
    "base:app_id": baseAppId,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="base:app_id" content={baseAppId} />
      </head>
      <body className={geistMono.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
