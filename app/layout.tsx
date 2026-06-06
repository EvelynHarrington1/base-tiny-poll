import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Base Tiny Poll",
  description: "Onchain micro poll mini app on Base.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="base:app_id" content="replace-with-your-base-dev-verify-token" />
      </head>
      <body className={geistMono.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
