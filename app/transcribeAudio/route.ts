import { AzureKeyCredential, OpenAIClient } from "@azure/openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("audio") as File;

  console.log(">>>",file);

  const apiKey = process.env.AZURE_API_KEY;
  const endpoint = process.env.AZURE_ENDPOINT;
  const deploymentName = process.env.AZURE_DEPLOYMENT_NAME;

  if (
    apiKey === undefined ||
    endpoint === undefined ||
    deploymentName === undefined
  ) {
    console.error("Azure credentials not set");
    return {
      sender: "",
      response: "Azure credentials not set",
    };
  }

  if (file.size === 0) {
    return {
      sender: "",
      response: "No Audio file provided",
    };
  }

  const arrayBuffer = await file.arrayBuffer();
  const audio = new Uint8Array(arrayBuffer);

  const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));

  const result = await client.getAudioTranscription(deploymentName, audio);

  console.log(`Transcription: ${result.text}`);

  return NextResponse.json({ text: result.text });
}
