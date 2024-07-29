import { GitHub, Google } from "arctic";

export const googleAuth = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.NEXT_PUBLIC_URL + "/api/auth/google/callback",
);

export const githubAuth = new GitHub(
  process.env.GITHUB_CLIENT_ID!,
  process.env.GITHUB_CLIENT_SECRET!
);