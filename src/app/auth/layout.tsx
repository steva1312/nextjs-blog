import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function AuthLayout({ children } : { children: React.ReactNode }) {
  const user = await getUser();

  if (user) {
    redirect("/");
  }

  return(
    <>
      {children}
    </>
  );
}