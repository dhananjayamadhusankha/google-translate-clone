"use server";

import { State } from "@/components/TranslationForm";
import { addOrUpdateUser } from "@/mongodb/models/User";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import { revalidateTag } from "next/cache";
import { v4 } from "uuid";

const key = process.env.AZURE_TEXT_TRANSLATION_KEY;
const endpoint = process.env.AZURE_TEXT_TRANSLATION;
const location = process.env.AZURE_TEXT_LOCATION;

export default async function translate(
  previousState: State,
  formData: FormData
) {
  auth().protect();

  const { userId } = auth();

  if (!userId) throw new Error("User not found");

  const rowFormData = {
    inputLanguage: formData.get("inputLanguage") as string,
    input: formData.get("input") as string,
    outputLanguage: formData.get("outputLanguage") as string,
    output: formData.get("output") as string,
  };

  //   request to the Azure Translator API to translate the input text

  const response = await axios({
    baseURL: endpoint,
    url: "translate",
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key!,
      "Ocp-Apim-Subscription-Region": location!,
      "Content-type": "application/json",
      "X-ClientTraceId": v4().toString(),
    },
    params: {
      "api-version": "3.0",
      from:
        rowFormData.inputLanguage === "auto" ? null : rowFormData.inputLanguage,
      to: rowFormData.outputLanguage,
    },
    data: [{ text: rowFormData.input }],
    responseType: "json",
  });

  const data = response.data;

  if (data.error) {
    console.log(`Error ${data.error.code}: ${data.error.message}`);
  }

  //   push to mongodb

  // If the input language is set to "auto", set it to the detected language
  if (rowFormData.inputLanguage === "auto") {
    rowFormData.inputLanguage = data[0].detectedLanguage.language;
  }

  try {
    const translation = {
      to: rowFormData.outputLanguage,
      from: rowFormData.inputLanguage,
      fromText: rowFormData.input,
      toText: data[0].translations[0].text,
    };

    addOrUpdateUser(userId, translation);
  } catch (error) {
    console.log(error);
  }

  revalidateTag("translationHistory");

  return {
    ...previousState,
    output: data[0].translations[0].text,
  };
}
