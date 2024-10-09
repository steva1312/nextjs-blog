export const dynamic = "force-dynamic";

import Blog from "@/components/blog";
import PopMessage from "@/components/pop-message";
import SignOutButton from "@/components/sign-out-button";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth";
import { getAllUserBlogs } from "@/server/queries";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Profile() {
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  const blogs = (await getAllUserBlogs(user.id)).sort((a, b) => {
    if (a.createdAt < b.createdAt) return 1;
    else if (a.createdAt > b.createdAt) return -1;
    else return 0;
  });

  return (
    <div className="flex flex-col w-full items-center pt-32 pb-10">
      <PopMessage />

      <div className="flex flex-col items-start w-[700px]">
        <div className="flex flex-col mb-12 gap-6">
          <div className="flex items-center gap-6">
            <Image src={user.picture || "/static/user.png"} className="rounded-full object-cover w-[100px] h-[100px]" alt="profile picture" width="100" height="100" />
            
            <div>
              <div className="text-xl">{user.fullName}</div>
              <div className="text-lg text-slate-600 mb-3">{user.email}</div>
              <div className="flex gap-2">
                <Link href="/profile/edit">
                  <Button className="text-base">Edit Profile</Button>
                </Link>
                <SignOutButton />
              </div>
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