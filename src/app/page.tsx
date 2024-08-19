import { getAllBlogs } from "@/server/queries";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {

  const blogs = await getAllBlogs();

  return (
    <div className="p-3">
      <h1 className="font-bold text-3xl">Stevin Blog</h1>

      <Link href="/auth/" className="underline text-xl">AUTH</Link>
    </div>
  );
}
