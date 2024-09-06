import PopMessage from "@/components/pop-message";
import SignOutButton from "@/components/sign-out-button";
import { getUser } from "@/lib/auth";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Profile() {
  const user = await getUser();

  if (!user) {
    redirect('/auth');
  }

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-start gap-5 bg-slate-100 p-5 rounded-md">
      <PopMessage />

      <div className="flex items-center gap-3">
        <Image src={user.picture ? user.picture : "/static/user.png"} className="rounded-full" alt="profile picture" width="60" height="60" />
        
        <div>
          <div className="text-lg">{user.fullName}</div>
          <div className="text-base text-slate-600">{user.email}</div>
        </div>
      </div>
      

      <SignOutButton />
    </div>
  );
}