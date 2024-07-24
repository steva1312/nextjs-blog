import { db } from "./db";
import { blogs } from "./db/schema";

export async function getAllBlogs() {
  const blogs = await db.query.blogs.findMany();

  return blogs;
}

export async function insertNewBlog(title: string, content: string) {
  await db.insert(blogs).values({
    title: title,
    content: content
  });
}