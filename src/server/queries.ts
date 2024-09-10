"use server";

import { WriteBlogSchema } from "@/app/write/write-blog-form";
import { db } from "./db";
import { blogs } from "./db/schema";
import { Blog } from "@/lib/schema-types";

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