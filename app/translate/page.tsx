import TranslationForm from "@/components/TranslationForm";
import { ITranslationLanguages } from "@/types/ITranslationLanguages";
import { auth } from "@clerk/nextjs/server";

async function TranslatePage() {
  auth().protect();

  const { userId } = auth();
  if (!userId) throw new Error("User not logged in");

  const languageEndPoint =
    "https://api.cognitive.microsofttranslator.com/languages?api-version=3.0";

  const response = await fetch(languageEndPoint, {
    next: {
      revalidate: 60 * 60 * 24,
    },
  });

  const languages = (await response.json()) as ITranslationLanguages;

  return (
    <div className="px-10 xl:px-0 mb-20">
      <TranslationForm languages={languages} />
    </div>
  );
}

export default TranslatePage;