import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import localFont from "next/font/local";
import "./styles/globals.css";
import Header from "@/components/header";

const ubuntu = localFont({
  src: [
    {
      path: "../../public/fonts/Ubuntu-Light.ttf",
      weight: "300"
    },
    {
      path: "../../public/fonts/Ubuntu-Regular.ttf",
      weight: "400"
    },
    {
      path: "../../public/fonts/Ubuntu-Medium.ttf",
      weight: "500"
    },
    {
      path: "../../public/fonts/Ubuntu-Bold.ttf",
      weight: "700"
    },
    {
      path: "../../public/fonts/Ubuntu-LightItalic.ttf",
      weight: "300",
      style: "italic"
    },
    {
      path: "../../public/fonts/Ubuntu-Italic.ttf",
      weight: "400",
      style: "italic"
    },
    {
      path: "../../public/fonts/Ubuntu-MediumItalic.ttf",
      weight: "500",
      style: "italic"
    },
    {
      path: "../../public/fonts/Ubuntu-BoldItalic.ttf",
      weight: "700",
      style: "italic"
    },
  ]
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
          <Header />
          {children}
        </main>
      </body>
    </html>
  );
}
