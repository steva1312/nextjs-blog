"use client";

import { resetPassword } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters long"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const router = useRouter();

  const { 
    register, 
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: searchParams.token,
      password: "",
      confirmPassword: ""
    }
  });

  async function onSubmit(values: ResetPasswordSchema) {
    const res = await resetPassword(values);

    if (res.success) {
      router.push("/auth");
    } else {
      alert(res.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
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
  );
}