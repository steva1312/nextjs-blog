import { BlogSelect, UserSelect } from "@/lib/schema-types";
import dateFormat from "dateformat";
import { Card, CardHeader, CardContent } from "./ui/card";
import Image from "next/image";import { getUser } from "@/server/queries";
import Link from "next/link";
import Like from "./like";
import { getUser as getWebUser } from "@/lib/auth";

export default async function Blog({ blog, user } : { blog: BlogSelect, user?: UserSelect }) {
  const webUser = await getWebUser();
   
  if (!user) {
    user = await getUser(blog.userId);
  }

  return (
    <Card key={blog.id} className="w-[700px]">
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex gap-3 items-center">
            <Link href={`/user/${blog.userId}`}>
              <Image src={user.picture || "/static/user.png"} width={40} height={40} alt="pp" className="rounded-full" />
            </Link>
            <div className="flex flex-col">
              <Link href={`/user/${blog.userId}`}>
                <div className="text-base font-normal">{user.fullName}</div>
              </Link>
              <div className="text-sm font-medium text-slate-500">{dateFormat(blog.createdAt, "mmm dS yyyy, HH:MM")}</div>
            </div>
          </div>

          <Like user={webUser} />
        </div>
      </CardHeader>

      <CardContent className="whitespace-pre-line flex flex-col gap-5">
        <div className="text-xl font-medium">{blog.title}</div>
        <div>{blog.content}</div>
      </CardContent>
    </Card>
  );
}