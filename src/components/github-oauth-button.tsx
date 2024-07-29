"use client";

import { getGithubOAuthUrl } from "@/lib/auth";

export default function GithubOauthButton() {

  async function onClick() {
    const url = await getGithubOAuthUrl();
    window.location.href = url;
  }

  return (
    <button onClick={onClick} className="bg-black text-white text-lg p-2">
      Sing in with Github
    </button>
  );
}