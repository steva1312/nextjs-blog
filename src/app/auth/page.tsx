import GithubOauthButton from "@/components/github-oauth-button";
import GoogleOauthButton from "@/components/google-oauth-button";
import SignUpForm from "@/components/sign-up-form";
import SignInForm from "@/components/sing-in-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Auth() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-10">
      <div className="flex flex-col w-[400px] mt-5 gap-2">
        <GoogleOauthButton>Continue with Google</GoogleOauthButton>
        <GithubOauthButton>Continue with GitHub</GithubOauthButton>
      </div>

      <Tabs defaultValue="sign-in" className="w-[400px]">
        <TabsList className="h-11 p-1">
          <TabsTrigger className="text-base" value="sign-in">Sign In</TabsTrigger>
          <TabsTrigger className="text-base" value="sign-up">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="sign-in">
          <SignInForm />
        </TabsContent>

        <TabsContent value="sign-up">
          <SignUpForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}