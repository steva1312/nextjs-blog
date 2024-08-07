"use client";

import { insertBlog } from "@/server/queries";
import { useRouter } from "next/navigation";
import { FormEvent, useRef } from "react";

interface Props {
  insertBlog: (title: string, content: string) => Promise<void>
}

export default function Form() {
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    insertBlog(titleRef.current!.value, contentRef.current!.value);

    router.refresh();
  }

  return (
    <form onSubmit={e => onSubmit(e)} className="flex flex-col w-[200px] space-y-4">
      <input ref={titleRef} name="title" className="border-black border-2" />
      <input ref={contentRef} name="content" className="border-black border-2" />
      <button className="bg-black text-white">Insert</button>
    </form>
  );
}