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
    <div className="p-4 space-y-4">
      <div>{user.fullName}</div>
      <div>{user.email}</div>
      {user.picture && <Image src={user.picture} className="w-10" alt="profile picture" width="20" height="20" />}

      <div>
        <SignOutButton />
      </div>
    </div>
  );
}