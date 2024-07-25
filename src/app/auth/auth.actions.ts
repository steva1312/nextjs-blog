"use server";

import { SignUpSchema } from "@/components/sign-up-form";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { Argon2id } from "oslo/password";

export async function signUp(values: SignUpSchema) {
  // const existingUser = await db.query.users.findFirst({
  //   where: (model , { eq }) => eq(model.email, values.email) 
  // });

  // if (existingUser) {
  //   return { error: "User already exists", success: false }; 
  // }

  const hashedPassword = await new Argon2id().hash(values.password)
  
  const newUser = await db.insert(users).values({
    fullName: values.fullName,
    email: values.email,
    hashedPassword: hashedPassword
  });
}