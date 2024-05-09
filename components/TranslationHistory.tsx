import { ITranslation } from "@/mongodb/models/User";
import { auth } from "@clerk/nextjs/server";
import TimeAgoText from "./TimeAgoText";
import DeleteTranslationButton from "./DeleteTranslationButton";

const getLanguages = (code: string) => {
  const lang = new Intl.DisplayNames(["en"], { type: "language" });
  return lang.of(code);
};

async function TranslationHistory() {
  const { userId } = auth();

  const url = `${
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.VERCEL_URL
  }/translationHistory?userId=${userId}`;

  const response = await fetch(url, {
    next: {
      tags: ["translationHistory"],
    },
  });

//   console.log(response);

  const { translations }: { translations: Array<ITranslation> } =
    await response.json();

//   console.log(translations);

  return (
    <div>
      <h1 className="text-3xl my-5">History</h1>
      {translations.length === 0 && (
        <p className="mb-5 text-gray-500">No translations history</p>
      )}

      <ul  className="border rounded-md divide-y">
        {translations.map((translation) => (
          <li key={translation._id} className="p-5 justify-between items-center flex hover:bg-gray-50 relative">
            <div>
              <p className="mb-5 text-sm text-gray-500">
                {getLanguages(translation.from)}
                {" -> "}
                {getLanguages(translation.to)}
              </p>
              <div className="pr-5 space-y-2">
                <p>{translation.fromText}</p>
                <p className="text-gray-400">{translation.toText}</p>
              </div>
            </div>

            <p className="absolute top-2 right-2 text-gray-300 text-sm">
                <TimeAgoText date={new Date(translation.timestamp).toISOString()} />
            </p>

            <DeleteTranslationButton id={translation._id} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TranslationHistory;
