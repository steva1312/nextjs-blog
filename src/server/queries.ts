"use server";

import { EditUserSchema } from "@/app/profile/edit/edit-form";
import { db } from "./db";
import { blogs, users } from "./db/schema";
import { Blog } from "@/lib/schema-types";
import { eq } from "drizzle-orm";
import { uploadProfilePicture } from "@/lib/s3";

export async function getAllBlogs() {
  const blogs = await db.query.blogs.findMany();

  return blogs;
}

export async function getAllUserBlogs(id: string) {
  const blogs = await db.query.blogs.findMany({
    where: (model, { eq }) => eq(model.userId, id)
  });

  return blogs;
}

export async function getBlog(id: string) {
  const blog = await db.query.blogs.findFirst({
    where: (model, { eq }) => eq(model.id, id)
  });

  if (!blog) throw new Error("Blog not found")

  return blog;
}

export async function insertBlog(values: Blog) {
  await db.insert(blogs).values(values);
}

export async function getUser(userId: string) {
  try {
    const user = await db.query.users.findFirst({
      where: (model, { eq }) => eq(model.id, userId)
    });

    if (!user) throw new Error("User doesn't exist");

    return user;
  } catch {
    throw new Error("Invalid id");
  }
}

export async function editUser(userId: string, values: EditUserSchema, formData: FormData | null) {
  if (formData) {
    const newProfilePicture = formData.get("newProfilePicture") as File;
    const newProfilePictureUrl = await uploadProfilePicture(userId, newProfilePicture);

    await db.update(users).set({ ...values, picture: newProfilePictureUrl })
    .where(
      eq(users.id, userId)
    );
  }
  else {
    await db.update(users).set({ ...values })
      .where(
        eq(users.id, userId)
      );
  }
}