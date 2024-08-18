"use server";

import { lucia } from "@/lib/lucia";
import { db } from "@/server/db";
import { resetTokens, users, verifyEmailTokens } from "@/server/db/schema";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { generateCodeVerifier, generateState } from "oslo/oauth2";
import { Argon2id } from "oslo/password";
import { githubAuth, googleAuth } from "./oauth";
import { ForgotPasswordSchema } from "@/components/forgot-password-form";
import { eq } from "drizzle-orm";
import { sendMail, MailData } from "./email";
import { ResetPasswordSchema } from "@/components/reset-password-form";
import { SignUpSchema } from "@/components/sign-up-form";
import { SignInSchema } from "@/components/sing-in-form";

const EMAIL_TOKEN_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 7; //7days

export async function signUp(values: SignUpSchema) {
  const existingUser = await db.query.users.findFirst({
    where: (model , { eq }) => eq(model.email, values.email) 
  });

  if (existingUser) {
    return { error: "User already exists", success: false }; 
  }

  const hashedPassword = await new Argon2id().hash(values.password)
  
  const [ user ] = await db.insert(users).values({
    accountType: "email",
    email: values.email,
    fullName: values.fullName,
    hashedPassword: hashedPassword
  }).returning();

  const tokenExpiresAt = new Date(Date.now() + EMAIL_TOKEN_EXPIRE_TIME);

  const [ token ] = await db.insert(verifyEmailTokens).values({
    userId: user.id,
    expiresAt: tokenExpiresAt,
  }).returning();

  const mailData: MailData = {
    email: values.email,
    subject: "Verify Email Adress",
    html: `
      Go to the following link to verify your email adress: <a href="${process.env.NEXT_PUBLIC_URL}/api/auth/verify-email/?token=${token.id}">${process.env.NEXT_PUBLIC_URL}/api/auth/verify-email/?token=${token.id}</a>
      <br>
      This link expires in 7 days.
    `
  };

  await sendMail(mailData);

  return { success: true };
}

export async function verifyEmail(tokenId: string) {
  if (!tokenId) {
    return { error: "Invalid request", success: false };
  }

  const token = await db.query.verifyEmailTokens.findFirst({
    where: (model, { eq }) => eq(model.id, tokenId)
  });

  if (!token) {
    return { error: "Invalid request", success: false };
  }

  if (token!.expiresAt < new Date(Date.now() - EMAIL_TOKEN_EXPIRE_TIME)) {
    return { error: "Link expired, try signing in and send receive another link", success: false } 
  }

  await db.update(users)
    .set({
      verified: true
    })
    .where(eq(users.id, token.userId));

  await db.delete(verifyEmailTokens).where(eq(verifyEmailTokens.id, token.id));

  const session = await lucia.createSession(token.userId, {});
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

  if (user.accountType !== "email") { 
    return { error: "This user doesn't use email and password sign in method", success: false };
  }

  const passwordMatch = await new Argon2id().verify(user.hashedPassword!, values.password);

  if (!passwordMatch) {
    return { error: "Invalid credentials", success: false };
  }

  if (!user.verified) {
    return { error: "Email adress is not verified yer! Check your mail to continue", success: false };
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
  return redirect("/auth/sign-in");
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

export async function getGithubOAuthUrl() {
  const state = generateState();

  cookies().set("github_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
  });

  const authUrl = await githubAuth.createAuthorizationURL(state, {
    scopes: ["user:email"]
  });

  return authUrl.toString();
}

const PASSWORD_TOKEN_EXPIRE_TIME = 1000 * 60 * 5; //5min

//generates token and sends mail
export async function forgotPassword(values: ForgotPasswordSchema) {
  const user = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.email, values.email)
  });

  if (!user) {
    return { error: "User not found", success: false };
  }

  if (user.accountType !== "email") { 
    return { error: "This user doesn't use email and password sign in method", success: false };
  }

  //deletes previous token if user sends another email
  await db.delete(resetTokens).where(eq(resetTokens.userId, user.id));

  const tokenExpiresAt = new Date(Date.now() + PASSWORD_TOKEN_EXPIRE_TIME);

  const [ token ] = await db.insert(resetTokens).values({
    userId: user.id,
    expiresAt: tokenExpiresAt,
  }).returning();

  const mailData: MailData = {
    email: values.email,
    subject: "Reset Password",
    html: `
      Go to the following link to change your password: <a href="${process.env.NEXT_PUBLIC_URL}/auth/reset-password/?token=${token.id}">${process.env.NEXT_PUBLIC_URL}/auth/reset-password/?token=${token.id}</a>
      <br>
      This link expires in 5 minutes.
    `
  };

  await sendMail(mailData);

  return { success: true };
}

export async function resetPassword(values: ResetPasswordSchema) {
  const token = await db.query.resetTokens.findFirst({
    where: (model, { eq }) => eq(model.id, values.token)
  });

  if (!token) {
    return { error: "Invalid token", success: false };
  }

  if (token!.expiresAt < new Date(Date.now() - PASSWORD_TOKEN_EXPIRE_TIME)) {
    return { error: "Token expired", success: false };
  }

  const hashedPassword = await new Argon2id().hash(values.password)

  await db.update(users)
    .set({
      hashedPassword: hashedPassword
    })
    .where(eq(users.id, token.userId));

  await db.delete(resetTokens).where(eq(resetTokens.id, token.id));

  return { success: true };
}