import Form from "@/components/form";
import { getAllBlogs, insertBlog } from "@/server/queries";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {

  const blogs = await getAllBlogs();

  return (
    <div className="p-3">
      <h1 className="font-bold text-3xl">Stevin Blog</h1>

      <div className="mt-2 mb-6">

      <Link className="underline text-xl" href="/auth">AUTH</Link>
      </div>

      <Form />

      <div className="mt-8 space-y-4">
        {blogs.map(blog => (
          <div key={blog.id}>
            <Link href={`/blogs/${blog.id}`}>
              <div className="font-bold text-lg">{blog.title}</div>
              <div>{blog.content}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
