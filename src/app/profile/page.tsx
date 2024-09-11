"use server";

import Header from "@/components/header";
import PopMessage from "@/components/pop-message";
import SignOutButton from "@/components/sign-out-button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getUser } from "@/lib/auth";
import { getAllUserBlogs } from "@/server/queries";
import Image from "next/image";
import { redirect } from "next/navigation";
import dateFormat from "dateformat";

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
          <Image src={user.picture || "/static/user.png"} className="rounded-full" alt="profile picture" width="100" height="100" />
          
          <div>
            <div className="text-xl">{user.fullName}</div>
            <div className="text-lg text-slate-600 mb-3">{user.email}</div>
            <SignOutButton />
          </div>

        </div>
        
        <div className="flex flex-col gap-10">
          {blogs.map(blog => 
            <Card key={blog.id} className="w-[700px]">
              <CardHeader className="text-xl font-medium">
                <div className="flex gap-3 items-center">
                  <Image src={user.picture || "/static/user.png"} width={40} height={40} alt="pp" className="rounded-full" />
                  <div className="flex flex-col">
                    <div className="text-base font-normal">{user.fullName}</div>
                    <div className="text-sm font-medium text-slate-500">{dateFormat(blog.createdAt, "mmm dS yyyy, HH:MM")}</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="whitespace-pre-line flex flex-col gap-5">
                <div className="text-xl font-medium">{blog.title}</div>
                <div>{blog.content}</div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}