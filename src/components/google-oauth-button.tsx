"use client";

import { getGoogleOAuthUrl } from "@/lib/auth";
import { Button } from "./ui/button";
import { ReactNode } from "react";
import { RiGoogleFill } from "@remixicon/react";

export default function GoogleOauthButton({children} : {children: ReactNode}) {

  async function onClick() {
    const url = await getGoogleOAuthUrl();
    window.location.href = url;
  }

  return (
    <Button className="p-5 text-md" onClick={onClick}>
      <RiGoogleFill className="w-5 h-5 mr-2" />
      {children}
    </Button>
  );
}