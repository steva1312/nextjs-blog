import { lucia } from "@/lib/lucia";
import { googleAuth } from "@/lib/oauth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { cookies } from "next/headers";
import { redirect, useRouter } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const codeVerifier = cookies().get("google_code_verifier")?.value;
  const savedState = cookies().get("google_oauth_state")?.value;

  if (!code || !state || !codeVerifier || !savedState || state !== savedState) {
    return new Response("Invalid request", { status: 400 });
  }

  let userId: string;

  try {
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


    if (existingUser) {
      if (existingUser.accountType !== "google") {
        return new Response("This user doesn't use google sign in method", { status: 400 });
      }

      userId = existingUser.id;
    } else {
      const [ user ] = await db.insert(users).values({
        accountType: "google",
        fullName: googleData.name,
        email: googleData.email,
        picture: googleData.picture,
        verified: true
      }).returning();

      userId = user.id;
    }
  } catch (e) {
    console.log(e);
    return new Response("Invalid request", { status: 400 });
  }


  const session = await lucia.createSession(userId, {});
  const sessionCookie = await lucia.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  return redirect("/profile");
}