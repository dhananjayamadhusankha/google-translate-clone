import { SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

const afterSignOutUrl = process.env.CLERK_AFTER_SIGN_OUT_URL;
const forceRedirectUrl = process.env.CLERK_SIGN_IN_FORCE_REDIRECT_URL;

function Header() {
  const { userId } = auth();
  return (
    <header className="flex justify-between items-center px-8 border-b mb-5">
      <div className="h-20 items-center overflow-hidden flex">
        <Link href="/">
          <Image
            src="https://links.papareact.com/xgu"
            alt="logo"
            width={200}
            height={100} className="h-32 object-contain cursor-pointer"
          />
        </Link>
      </div>
      {userId ? (
        <div>
          <UserButton afterSignOutUrl={afterSignOutUrl} />
        </div>
      ) : (
        <SignedOut>
          <SignInButton forceRedirectUrl={forceRedirectUrl} mode={"modal"} />
        </SignedOut>
      )}
    </header>
  );
}

export default Header;
