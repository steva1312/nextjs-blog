import { db } from "./db";
import { blogs } from "./db/schema";

export async function getAllBlogs() {
  const blogs = await db.query.blogs.findMany();

  return blogs;
}

export async function getBlog(id: number) {
  const blog = await db.query.blogs.findFirst({
    where: (model, { eq }) => eq(model.id, id)
  });

  if (!blog) throw new Error("Blog not found")

  return blog;
}

export async function insertBlog(title: string, content: string) {
  await db.insert(blogs).values({
    title: title,
    content: content
  });
}