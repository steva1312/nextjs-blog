import Form from "@/components/form";
import { getAllBlogs, insertNewBlog } from "@/server/queries";

export const dynamic = "force-dynamic";

export default async function Home() {

  const blogs = await getAllBlogs();

  return (
    <div className="p-3">
      <h1 className="font-bold text-3xl">Stevin Blog</h1>

      <Form insertBlog={async (title: string, content: string) => {
        "use server";

        await insertNewBlog(title, content);
      }} />

      <div className="mt-8 space-y-4">
        {blogs.map(blog => (
          <div key={blog.id}>
            <div className="font-bold text-lg">{blog.title}</div>
            <div>{blog.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
