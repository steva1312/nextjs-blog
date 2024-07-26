import SignOutButton from "@/components/sign-out-button";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Profile() {
  const user = await getUser();

  if (!user) {
    redirect('/auth');
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        PUSI GA {user.fullName}
      </div>

      <div>
        <SignOutButton />
      </div>
    </div>
  );
}