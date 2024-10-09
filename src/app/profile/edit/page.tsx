import { getUser } from "@/lib/auth";
import EditForm from "./edit-form";
import { redirect } from "next/navigation";

export default async function EditProfile() {
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <EditForm user={user} />
    </div>
  );
}