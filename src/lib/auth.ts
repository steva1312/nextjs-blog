"use server";

import { SignInSchema } from "@/components/sign-in-form";
import { SignUpSchema } from "@/components/sign-up-form";
import { lucia } from "@/lib/lucia";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { generateCodeVerifier, generateState } from "oslo/oauth2";
import { Argon2id } from "oslo/password";
import { googleAuth } from "./oauth";

export async function signUp(values: SignUpSchema) {
  const existingUser = await db.query.users.findFirst({
    where: (model , { eq }) => eq(model.email, values.email) 
  });

  if (existingUser) {
    return { error: "User already exists", success: false }; 
  }

  const hashedPassword = await new Argon2id().hash(values.password)
  
  const [ user ] = await db.insert(users).values({
    fullName: values.fullName,
    email: values.email,
    hashedPassword: hashedPassword
  }).returning();

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = await lucia.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  return { success: true };
}

export async function signIn(values: SignInSchema) {
  const user = await db.query.users.findFirst({
    where: (model , { eq }) => eq(model.email, values.email) 
  });
  
  if (!user) { 
    return { error: "User doesn't exist", success: false };
  }

  if (!user.hashedPassword) { 
    return { error: "This user doesn't use email and password sign in method", success: false };
  }

  const passwordMatch = await new Argon2id().verify(user.hashedPassword, values.password);

  if (!passwordMatch) {
    return { error: "Invalid credentials", success: false };
  }

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = await lucia.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  return { success: true };
}

export async function getUser() {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value || null;

  if (!sessionId) return null;
  
  const { session, user } = await lucia.validateSession(sessionId);

  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return null;
  }
  
  if (session && session.fresh) {
    //refresh cookie
    const sessionCookie = await lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  }

  const dbUser = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.id, user.id)
  });

  return dbUser || null;
}

export async function signOut() {
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  return redirect("/auth");
}

export async function getGoogleOAuthUrl() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  cookies().set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
  });

  cookies().set("google_code_verifier", codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
  });

  const authUrl = await googleAuth.createAuthorizationURL(state, codeVerifier, {
    scopes: ["email", "profile"]
  });

  return authUrl.toString();
}