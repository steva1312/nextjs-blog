import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import { Toaster } from "react-hot-toast"
import "./styles/globals.css";

const ubuntu = Ubuntu({ 
  weight: ["300", "400", "500", "700" ], 
  subsets: ["latin"] 
});

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
      <body className={ubuntu.className}>
        <Toaster position="bottom-right" toastOptions={{duration: 8000}} />

        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
