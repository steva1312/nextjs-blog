"use client";

import { getGoogleOAuthUrl } from "@/lib/auth";

export default function GoogleOauthButton() {

  async function onClick() {
    const url = await getGoogleOAuthUrl();
    window.location.href = url;
  }

  return (
    <button onClick={onClick} className="bg-black text-white text-lg p-2">
      Continue with Google
    </button>
  );
}