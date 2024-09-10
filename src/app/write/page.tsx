import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import WriteBlogForm from "./write-blog-form";

export default async function Write() {
  const user = await getUser();

  if (!user) {
    redirect("/auth");
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[700px]">
        <WriteBlogForm user={user} />
      </div>
    </div>
  );
}