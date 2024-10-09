"use server";

import Blog from "@/components/blog";
import { getAllUserBlogs, getUser } from "@/server/queries";
import Image from "next/image";
import dateFormat from "dateformat";

export default async function User({
  params: { id: userId }
} : {
  params: { id: string }
}) {
  const user = await getUser(userId);

  const blogs = (await getAllUserBlogs(user.id)).sort((a, b) => {
    if (a.createdAt < b.createdAt) return 1;
    else if (a.createdAt > b.createdAt) return -1;
    else return 0;
  });

  return (
    <div className="flex flex-col w-full items-center pt-32 pb-10">
      <div className="flex flex-col items-start w-[700px]">
        <div className="flex flex-col mb-12 gap-6">
          <div className="flex items-center gap-6">
            <Image src={user.picture || "/static/user.png"} className="rounded-full" alt="profile picture" width="80" height="80" />
            <div>
              <div className="text-xl">{user.fullName}</div>
              <div className="text text-slate-600">Joined on {dateFormat(user.createdAt, "mmmm dS yyyy")}</div>
            </div>

          </div>

          <div>{user.description}</div>
        </div>
        
        <div className="flex flex-col gap-10">
          {blogs.map(blog => 
            <Blog blog={blog} user={user} key={blog.id} />
          )}
        </div>
      </div>
    </div>
  );
}