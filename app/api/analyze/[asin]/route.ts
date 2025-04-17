import OpenAI from "openai";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Initialize OpenAI client with your API key (Grok model)
const client = new OpenAI({
  apiKey: "xai-WPapwYcNcKLfq7UqIr7SIttRCVU6x7WzfmF3dff3QvW4uB2DAmI5J0M03ayEcffcgwdfE8qJzmLOefTq",
  baseURL: "https://api.x.ai/v1",
});

// Function to get Amazon product analysis
const getAmazonAnalysis = async (asin: string) => {
  try {
    // Send request to Grok model to analyze the ASIN
    const completion = await client.chat.completions.create({
      model: "grok-2-latest",
      messages: [
        {
          role: "system",
          content: "You are Grok, a chatbot inspired by the Hitchhiker's Guide to the Galaxy. You analyze Amazon products and suggest improvements."
        },
        {
          role: "user",
          content: `Analyze the Amazon product with ASIN ${asin} and provide suggestions for improving the listing.`,
        },
      ],
    });

    // Extract analysis from the API response (handle as string or object)
    const analysis = completion.choices[0].message.content;

    // If the analysis is a string, return it directly
    if (typeof analysis === 'string') {
      return analysis;
    }

    // If the analysis is not a string, handle appropriately (could be an object or array)
    return "Analysis was not in the expected format.";
  } catch (error) {
    console.error("Grok Analysis Error:", error);
    throw new Error("Failed to perform Amazon ASIN analysis.");
  }
};

// The GET method to handle the analysis request for a given ASIN
export async function GET(req: NextRequest, { params }: { params: { asin: string } }) {
  const { asin } = params; 

  if (!asin) {
    return NextResponse.json({ error: 'ASIN is required' }, { status: 400 });
  }

  try {
    // Get the analysis for the ASIN
    const analysis = await getAmazonAnalysis(asin);
    
    // Return the analysis as a JSON response
    return NextResponse.json({ result: analysis });
  } catch (error) {
    console.error('Analysis Error:', error);
    return NextResponse.json({ error: 'Error performing analysis' }, { status: 500 });
  }
}
