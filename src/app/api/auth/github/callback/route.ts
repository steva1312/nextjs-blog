import { lucia } from "@/lib/lucia";
import { githubAuth } from "@/lib/oauth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const savedState = cookies().get("github_oauth_state")?.value;

  if (!code || !state || !savedState || state !== savedState) {
    return new Response("Invalid request", { status: 400 });
  }

  try {
    const { accessToken } = await githubAuth.validateAuthorizationCode(code);

    const githubResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const githubData: GithubUser= await githubResponse.json();

    if (!githubData.email) {
      const githubEmailsResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const emails: Email[] = await githubEmailsResponse.json();

      const primaryEmail = emails.find(email => email.primary)!.email;

      githubData.email = primaryEmail;
    }

    const existingUser = await db.query.users.findFirst({
      where: (model , { eq }) => eq(model.email, githubData.email) 
    });

    let userId: string;

    if (existingUser) {
      if (existingUser.accountType !== "github") {
        return new Response("This user doesn't use github sign in method", { status: 400 });
      }

      userId = existingUser.id;
    } else {
      const [ user ] = await db.insert(users).values({
        accountType: "github",
        fullName: githubData.name || githubData.login,
        email: githubData.email,
        picture: githubData.avatar_url,
        verified: true
      }).returning();

      userId = user.id;
    }

    
    const session = await lucia.createSession(userId, {});
    const sessionCookie = await lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/profile"
      }
    });
  } catch {
    console.log('alobe')
    return new Response("Invalid request", { status: 400 });
  }
}

interface GithubUser {
  login: string,
  avatar_url: string,
  name: string,
  email: string
}

interface Email {
  email: string,
  primary: boolean
}