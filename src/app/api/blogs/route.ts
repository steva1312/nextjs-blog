import { db } from "@/server/db"

export async function GET(request: Request) {
  const blogs = await db.query.blogs.findMany();

  return new Response(JSON.stringify(blogs));
}