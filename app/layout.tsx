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
        <meta name="base:app_id" content="6a24ea8f95cfa95c11629b7b" />
        <meta
          name="talentapp:project_verification"
          content="ed1ef2f5ffb0a8d034e90eae50ecd2357028f3658e6e39ba016eb71efeac308023dd224a5149ff8c76d98b0e1945ca48a30556c81f3261fecfe5dffb807c131e"
        />
      </head>
      <body className={geistMono.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
