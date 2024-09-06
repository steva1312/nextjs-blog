import { verifyEmail } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return new Response("Invalid request", { status: 400 });
  }

  const res = await verifyEmail(token);

  if (res.success) {
    return redirect("/profile?succMsg=Successfuly created account.");
  }
  
  return new Response(res.error, { status: 400 });
}