import GithubOauthButton from "@/components/github-oauth-button";
import GoogleOauthButton from "@/components/google-oauth-button";
import SignInForm from "@/components/sing-in-form";
import Link from "next/link";

export default function SignIn() {
  return (
    <div className="flex flex-col items-start space-y-8 p-4">
      <h1 className="text-xl font-bold">SIGN UP</h1>
      <SignInForm />
      <GoogleOauthButton />
      <GithubOauthButton />

      <Link href="/auth/sign-in" className="underline">Already have an account? Sign in here</Link>
    </div>
  );
}