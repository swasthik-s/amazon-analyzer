import OpenAI from "openai";
import { NextResponse, NextRequest } from "next/server";

const client = new OpenAI({
  apiKey: process.env.GROK_API_KEY!, // The `!` assumes you've defined it
  baseURL: "https://api.x.ai/v1",
});

const getAmazonAnalysis = async (asin: string) => {
  try {
    const completion = await client.chat.completions.create({
      model: "grok-2-latest",
      messages: [
        {
          role: "system",
          content: "You are Grok, a chatbot inspired by the Hitchhiker's Guide to the Galaxy. You analyze Amazon products and suggest improvements.",
        },
        {
          role: "user",
          content: `Analyze the Amazon product with ASIN ${asin} and provide suggestions for improving the listing.`,
        },
      ],
    });

    const analysis = completion.choices[0].message.content;
    return typeof analysis === "string" ? analysis : "Unexpected format from Grok.";
  } catch (error) {
    console.error("Grok Analysis Error:", error);
    throw new Error("Failed to perform Amazon ASIN analysis.");
  }
};

export async function GET(req: NextRequest, { params }: { params: { asin: string } }) {
  const { asin } = params;

  if (!asin) {
    return NextResponse.json({ error: "ASIN is required" }, { status: 400 });
  }

  try {
    const analysis = await getAmazonAnalysis(asin);
    return NextResponse.json({ result: analysis });
  } catch (error) {
    return NextResponse.json({ error: "Error performing analysis" }, { status: 500 });
  }
}
