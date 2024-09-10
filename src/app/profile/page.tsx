"use server";

import Header from "@/components/header";
import PopMessage from "@/components/pop-message";
import SignOutButton from "@/components/sign-out-button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getUser } from "@/lib/auth";
import { getAllUserBlogs } from "@/server/queries";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Profile() {
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  const blogs = await getAllUserBlogs(user.id);

  return (
    <div className="flex flex-col w-full items-center pt-32 pb-10">
      <PopMessage />

      <Header />

      <div className="flex flex-col items-start w-[700px]">
        <div className="flex items-center gap-6 mb-12">
          <Image src={user.picture ? user.picture : "/static/user.png"} className="rounded-full" alt="profile picture" width="100" height="100" />
          
          <div>
            <div className="text-xl">{user.fullName}</div>
            <div className="text-lg text-slate-600 mb-3">{user.email}</div>
            <SignOutButton />
          </div>

        </div>
        
        <div className="flex flex-col gap-10">
          {blogs.map(blog => 
            <Card key={blog.id} className="w-[700px]">
              <CardHeader className="text-xl font-medium">{blog.title}</CardHeader>
              <CardContent className="whitespace-pre-line">{blog.content}</CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}