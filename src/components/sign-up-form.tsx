"use client";

import { signUp } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

  const { 
    register, 
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  async function onSubmit(values: SignUpSchema) {
    const res = await signUp(values);

    if (res.success) {
      router.push('/profile');
    } else {
      alert(res.error);
    }
  }

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-bold">SIGN UP</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">

        <div className="flex items-center gap-2">
          <label htmlFor="fullName">Full name:</label>
          <input 
            {...register("fullName")} 
            id="fullName" 
            name="fullName" 
            type="text" 
            placeholder="Enter you full name"
            className="border-black border-2 p-1"
          />
          {errors.fullName && <p>{errors.fullName.message}</p>}
        </div>

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

        <div className="flex items-center gap-2">
          <label htmlFor="confirmPassword">Confirm password:</label>
          <input 
            {...register("confirmPassword")} 
            id="confirmPassword" 
            name="confirmPassword" 
            type="password"
            placeholder="Confirm you password"
            className="border-black border-2 p-1"
          />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>} 
        </div>

        <button disabled={isSubmitting} type="submit" className="self-start bg-black text-white p-2">Submit</button>
      </form>
    </div>
  );
}