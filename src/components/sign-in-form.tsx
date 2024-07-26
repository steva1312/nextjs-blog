"use client";

import { signIn } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Missing field")
});

export type SignInSchema = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const router = useRouter();

  const { 
    register, 
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  async function onSubmit(values: SignInSchema) {
    const res = await signIn(values);

    if (res.success) {
      router.push('/profile');
    } else {
      alert(res.error);
    }
  }

  return (
    <div className="p-4 space-y-2">
      <h1 className="text-xl font-bold">SIGN IN</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">

        <div className="flex items-center gap-2">
          <label htmlFor="email">Email:</label>
          <input 
            {...register("email")} 
            id="email" 
            name="email" 
            type="text" 
            placeholder="Enter you email"
            className="border-black border-2 p-1"
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="password">Password:</label>
          <input 
            {...register("password")} 
            id="password" 
            name="password" 
            type="password"
            placeholder="Enter you password"
            className="border-black border-2 p-1"
          />
          {errors.password && <p>{errors.password.message}</p>} 
        </div>

        <button disabled={isSubmitting} type="submit" className="self-start bg-black text-white p-2">Submit</button>
      </form>
    </div>
  );
}