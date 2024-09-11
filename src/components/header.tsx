import Link from "next/link";
import { Button } from "./ui/button";
import { getUser } from "@/lib/auth";
import Image from "next/image";
import { Plus } from 'lucide-react';

export default async function Header() {
  const user = await getUser();

  return (
    <header className="absolute top-0 w-full flex justify-between items-center px-8 pt-6">
      <Link href="/">
        <img src="/static/logo.png" className="h-11" />
      </Link>

      <nav className="absolute top-1/2 left-1/2 -translate-x-1/2">
        <ul className="flex gap-8">
          <li><Link href="/about" className="text-lg">About</Link></li>
          <li><Link href="/blogs" className="text-lg">Blogs</Link></li>
        </ul>
      </nav>

      <div className="flex items-center gap-3">
        <Link href="write">
          <Button className="text-lg py-6">
            <Plus className="mr-1" /> New Blog
          </Button>
        </Link>

        {
          !user ?

          <Link href="/auth" className="text-lg text-primary font-medium hover:bg-red-100 py-2 px-4 rounded-md duration-200">Sign In</Link> :

          <Link href="/profile" className="flex items-center gap-2 cursor-pointer bg-red-100 p-2 rounded-md hover:bg-red-200 duration-200" >
            <Image src={user.picture || "/static/user.png"} height="30" width="30" alt="pp" className="rounded-full" />
            <div className="text-base">{user.fullName}</div>
          </Link>
        }
      </div>

      
      
    </header>
  );
}