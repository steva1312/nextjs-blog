import { getBlog } from "@/server/queries";

export default async function Blog({
  params: { id: blogId }
}: {
  params: { id: string }
}) {
  const idAsNumber = Number(blogId);

  const blog = await getBlog(idAsNumber);

  return (
    <div>
      <div className="font-bold text-lg">{blog.title}</div>
      <div>{blog.content}</div>
    </div>
  );
}