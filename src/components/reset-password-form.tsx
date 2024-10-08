"use client";

import { resetPassword } from "@/lib/auth";
import { ResetPasswordSchema, resetPasswordSchema } from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function ResetPasswordForm({ token } : {token: string}) {
  const router = useRouter();

  const { 
    register, 
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token,
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