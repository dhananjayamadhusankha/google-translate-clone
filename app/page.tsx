import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

const clerkSignInFallbakRedirectUrl =
  process.env.CLERK_SIGN_IN_FORCE_REDIRECT_URL || "/";

export default function Home() {
  const { userId } = auth();
  return (
    <main className="flex flex-col items-center justify-center p-10 lg:p-4">
      <h1 className="text-3xl lg:text-6xl text-center font-light pb-10 mb-5 lg:mb-0 lg:pb-7">
        Understand your world and communicate across languages
      </h1>

      <Image
        src="https://links.papareact.com/ert"
        width={700}
        height={700}
        alt="logo"
      />
      {userId ? (
        <Link
          href={clerkSignInFallbakRedirectUrl}
          className="bg-blue-500 hover:bg-blue-600 text-white w-full text-center mt-10 rounded-md lg:w-fit p-5 cursor-pointer"
        >
          Translate Now
        </Link>
      ) : (
        <Button className="bg-blue-500 hover:bg-blue-600 text-white w-full text-center mt-10 rounded-md lg:w-fit p-5 cursor-pointer">
          <SignInButton
            signUpForceRedirectUrl={clerkSignInFallbakRedirectUrl}
            mode="modal"
          >
            Sign In to Get Translating
          </SignInButton>
        </Button>
      )}
    </main>
  );
}
