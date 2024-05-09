import { auth } from "@clerk/nextjs/server";
import React from "react";

async function TranslationHistory() {
  const { userId } = auth();

  const url = `${
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.VERCEL_URL
  }/translationHistory?userId=${userId}`;

  const responce = await fetch(url, { 
    next: {
        tags: ['translationHistory']
    }
  })
  return <div>TranslationHistory</div>;
}

export default TranslationHistory;
