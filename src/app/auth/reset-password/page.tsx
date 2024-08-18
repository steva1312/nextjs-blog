"use client";

import ResetPasswordForm from "@/components/reset-password-form";

export default function ResetPassword({
  searchParams,
}: {
  searchParams: { token: string };
}) {

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-bold">RESET PASSWORD</h1>
      <ResetPasswordForm token={searchParams.token} />
    </div>
  );
}