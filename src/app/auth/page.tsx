import GithubOauthButton from "@/components/github-oauth-button";
import GoogleOauthButton from "@/components/google-oauth-button";
import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";

export default function Auth() {
  return (
    <div className="p-4 space-y-10 flex flex-col items-start">
      <SignUpForm />
      <SignInForm />
      <GoogleOauthButton />
      <GithubOauthButton />
    </div>
  );
}