import { auth } from "@clerk/nextjs/server";

function TranslatePage() {
  auth().protect();

  const {userId} = auth();
  return <div>TranslatePage</div>;
}

export default TranslatePage;
