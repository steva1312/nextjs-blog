"use client";

import { forgotPassword } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const router = useRouter();

  const { 
    register, 
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    }
  });

  async function onSubmit(values: ForgotPasswordSchema) {
    const res = await forgotPassword(values);

    if (res.success) {
      alert('mail sent');
    } else {
      alert(res.error);
    }

  }

  return (
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

      <button disabled={isSubmitting} type="submit" className="self-start bg-black text-white p-2">Submit</button>
    </form>
  );
}