"use client";

import { getGithubOAuthUrl } from "@/lib/auth";
import { Button } from "./ui/button";
import { ReactNode } from "react";
import { RiGithubFill } from "@remixicon/react"

export default function GithubOauthButton({children} : {children: ReactNode}) {
  async function onClick() {
    const url = await getGithubOAuthUrl();
    window.location.href = url;
  }

  return (
    <Button className="p-5 text-md" onClick={onClick}>
      <RiGithubFill className="w-6 h-6 mr-2" />
      {children}
    </Button>
  );
}