"use client";

import { signIn } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { toast } from "react-hot-toast";
import { signInSchema, SignInSchema } from "@/lib/zod-schemas";

export default function SignInForm() {
  const router = useRouter();

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  async function onSubmit(values: SignInSchema) {
    const res = signIn(values);

    toast.promise(res, {
      loading: "Signing in...",
      success: () => {
        router.push("/profile");
        return "Successfuly signed in.";
      },
      error: (err) => `${err}`.split("Error: ")[1]
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back!</CardTitle>
        <CardDescription className="text-base">Log in to continue</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Email</FormLabel>
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Password</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="password"
                      onChange={e => {
                        e.target.value = e.target.value.trim();
                        field.onChange(e);
                      }}
                      placeholder="Enter your password..."
                      className="text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button variant="black" disabled={form.formState.isSubmitting} type="submit" className="text-base self-start mt-2">Sign In</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
    
  );
}