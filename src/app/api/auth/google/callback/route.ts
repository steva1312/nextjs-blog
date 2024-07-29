import { lucia } from "@/lib/lucia";
import { googleAuth } from "@/lib/oauth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return new Response("Invalid request", { status: 400 });
  }

  const codeVerifier = cookies().get("google_code_verifier")?.value;
  const savedState = cookies().get("google_oauth_state")?.value;

  if (!codeVerifier || !savedState) {
    return new Response("Invalid request", { status: 400 });
  }

  if (state !== savedState) {
    return new Response("Invalid request", { status: 400 });
  }

  const { accessToken } = await googleAuth.validateAuthorizationCode(code, codeVerifier);

  const googleResponse = await fetch("https://www.googleapis.com/oauth2/v1/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  const googleData = (await googleResponse.json()) as {
    id: string,
    email: string,
    name: string,
    picture: string
  };

  const existingUser = await db.query.users.findFirst({
    where: (model , { eq }) => eq(model.email, googleData.email) 
  });

  let userId: string;

  if (existingUser) {
    userId = existingUser.id;
  } else {
    const [ user ] = await db.insert(users).values({
      fullName: googleData.name,
      email: googleData.email,
      picture: googleData.picture
    }).returning();

    userId = user.id;
  }

  const session = await lucia.createSession(userId, {});
  const sessionCookie = await lucia.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  return redirect("/profile");
}