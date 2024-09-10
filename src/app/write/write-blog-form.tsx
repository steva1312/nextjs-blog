"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Blog, User } from "@/lib/schema-types";
import { insertBlog } from "@/server/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const writeBlogSchema = z.object({
  title: z.string().min(1, "Missing field"),
  content: z.string().min(1, "Missing field")
});

export type WriteBlogSchema = z.infer<typeof writeBlogSchema>;

export default function WriteBlogForm({ user } : { user: User }) {
  const router = useRouter();

  const form = useForm<WriteBlogSchema>({
    resolver: zodResolver(writeBlogSchema),
    defaultValues: {
      title: "",
      content: "",
    }
  });

  async function onSubmit(values: WriteBlogSchema) {
    const blog: Blog = {
      title: values.title,
      content: values.content,
      userId: user.id!
    };

    await insertBlog(blog);

    router.push("/profile?succMsg=Blog posted!");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a blog</CardTitle>
        <CardDescription className="text-base">Tell others what's on your mind!</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Title</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder="Enter blog title..."
                      className="text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field}
                      placeholder="Write content..."
                      className="text-base resize-none"
                      rows={10}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button size="lg" disabled={form.formState.isSubmitting} type="submit" className="text-lg self-start mt-2">Post</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}