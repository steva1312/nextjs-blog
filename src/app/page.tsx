import Blog from "@/components/blog";
import Header from "@/components/header";
import { getAllBlogs } from "@/server/queries";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const blogs = (await getAllBlogs()).sort((a, b) => {
    if (a.createdAt < b.createdAt) return 1;
    else if (a.createdAt > b.createdAt) return -1;
    else return 0;
  }); 

  return (
    <>
      <section className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-white to-red-200/60 gap-2 pb-20">
        <h1 className="text-5xl font-bold">What's on your mind?</h1>
        <h2 className="text-2xl font-medium i text-red-700">Share your daily life with other people</h2>

        <Link href="#recent-blogs" className="absolute bottom-16 text-xl text-red-700 font-medium flex items-center gap-2">
          <ChevronDown className="size-7 mt-1" /> Check out most recent blogs <ChevronDown  className="size-7 mt-1" />
        </Link>
      </section>

      <section id="recent-blogs" className="min-h-screen py-10 flex flex-col items-center gap-7">
        <div className="flex flex-col items-center gap-6">
          {blogs.map(blog => 
            <Blog blog={blog} key={blog.id} />
          )}
        </div>

        <div className="text-lg flex items-center gap-2 underline cursor-pointer">
          <ChevronDown className="size-5 mt-1" /> Load more blogs <ChevronDown  className="size-5 mt-1" />
        </div>
      </section>
    </>
  );
}
