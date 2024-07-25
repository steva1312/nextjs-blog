import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";

export default function Auth() {
  return (
    <div className="space-y-10">
      <SignUpForm />
      <SignInForm />
    </div>
  );
}