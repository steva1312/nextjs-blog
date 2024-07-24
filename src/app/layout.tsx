import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./styles/globals.css";

const ubuntu = Ubuntu({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stevin Blog",
  description: "Stevin najjaci blog na svetu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={ubuntu.className}>{children}</body>
    </html>
  );
}
