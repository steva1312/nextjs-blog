"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserSelect } from "@/lib/schema-types";
import { Pencil } from "lucide-react";
import { editUser } from "@/server/queries";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

const editUserSchema = z.object({
  fullName: z.string().min(1, "Missing field"),
  description: z.string()
});

export type EditUserSchema = z.infer<typeof editUserSchema>;

export default function EditForm({ user } : { user: UserSelect }) {
  const router = useRouter();

  const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);

  const form = useForm<EditUserSchema>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      fullName: user.fullName,
      description: user.description || ""
    }
  });

  async function onSubmit(values: EditUserSchema) {
    let formData = null;
    
    if (newProfilePicture) {
      formData = new FormData();
      formData.append("newProfilePicture", newProfilePicture);
    }

    const res = editUser(user.id, values, formData);

    toast.promise(res, {
      loading: "Updating...",
      success: "Profile updated.",
      error: "Something went wrong."
    }).then(() => {
      router.push("/profile");
    });
  }

  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Edit your profile</CardTitle>
        <CardDescription className="text-md">Change profile picture, add description...</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel  className="text-base">Full name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        {...field} 
                        placeholder="Enter your full name..."
                        className="text-base pr-8"
                      />
                      <Pencil className="size-5 text-slate-600 absolute right-2 top-1/2 -translate-y-1/2" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Description</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea 
                        {...field}
                        placeholder="Write about you!"
                        className="text-base resize-none pr-8"
                        rows={3}
                      />
                      <Pencil className="size-5 text-slate-600 absolute right-2 top-1/2 -translate-y-1/2" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          
            <div className="flex flex-col gap-3">
              <div className="font-medium">Profile picture</div>
              <Image 
                className="rounded-full object-cover w-[100px] h-[100px]" 
                src={(newProfilePicture && URL.createObjectURL(newProfilePicture)) || user.picture || "/static/user.png"} width={100} height={100} alt="pp" 
              />
              <Input
                onChange={e => {
                  setNewProfilePicture((e.target.files!)[0]);
                }}
                type="file"
                accept=".png, .jpg, .jpeg"
                className="text-sm pr-8 cursor-pointer"
              />
            </div>

            <Button variant="black" disabled={form.formState.isSubmitting} type="submit" className="text-base self-start mt-2">Save</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}