"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long")
});

export type SignInSchema = z.infer<typeof signInSchema>;

export default function SignInForm() {
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

  function onSubmit(values: SignInSchema) {
    console.log(values);
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