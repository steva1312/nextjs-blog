import { getBlog } from "@/server/queries";

export default async function Blog({
  params: { id: blogId }
}: {
  params: { id: string }
}) {
  const blog = await getBlog(blogId);

  return (
    <div>
      <div className="font-bold text-lg">{blog.title}</div>
      <div>{blog.content}</div>
    </div>
  );
}