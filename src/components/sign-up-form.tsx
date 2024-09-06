"use client";

import { signUp } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { toast } from "react-hot-toast";

export const signUpSchema = z.object({
  fullName: z.string().min(1, "Missing field"),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters long"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export type SignUpSchema = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const router = useRouter();

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  async function onSubmit(values: SignUpSchema) {
    const res = signUp(values);

    toast.promise(res, {
      loading: "Sending email...",
      success: "We sent you a mail to your email adress to verify it's you.",
      error: "Something went wrong."
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Begin your journey!</CardTitle>
        <CardDescription className="text-md">Create account to continue</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel  className="text-base">Email</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter your mail..."
                      className="text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel  className="text-base">Full name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter your full name..."
                      className="text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel  className="text-base">Password</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="password"
                      onChange={e => {
                        e.target.value = e.target.value.trim();
                        field.onChange(e);
                      }}
                      placeholder="Enter your password..."
                      className="text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel  className="text-base">Confirm assword</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="password"
                      onChange={e => {
                        e.target.value = e.target.value.trim();
                        field.onChange(e);
                      }}
                      placeholder="Confirm your password..."
                      className="text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={form.formState.isSubmitting} type="submit" className="text-base self-start mt-2">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}