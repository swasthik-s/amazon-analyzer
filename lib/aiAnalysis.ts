import puppeteer from 'puppeteer';
import fetch from 'node-fetch';

// Scrape Amazon listing page
const scrapeAmazonPage = async (asin: string) => {
  const browser = await puppeteer.launch({
    headless: true // Using headless mode
  });
  const page = await browser.newPage();

  // Go to the Amazon page for the ASIN
  await page.goto(`https://www.amazon.com/dp/${asin}`);

  // Scrape title, bullet points, description, etc.
  const title = await page.$eval('span#productTitle', el => el.textContent?.trim() || '')
    .catch(() => 'Title not found');
    
  const bulletPoints = await page.$$eval('.a-unordered-list li', items => 
    items.map(item => item.textContent?.trim() || ''))
    .catch(() => []);
    
  const description = await page.$eval('#productDescription', el => el.textContent?.trim() || '')
    .catch(() => 'Description not found');

  await browser.close();

  return { title, bulletPoints, description };
};

// Using OpenRouter.ai API for text analysis
const analyzeText = async (text: string) => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}` // Get your API key
      },
      body: JSON.stringify({
        model: "openrouter/zephyr", // or another model available on OpenRouter.ai
        messages: [
          {
            role: "system",
            content: "You are an Amazon listing optimization expert.",
          },
          {
            role: "user",
            content: `Please analyze and optimize the following Amazon listing content: ${text}`
          }
        ]
      })
    });

    const result = await response.json();
    return result.choices?.[0]?.message?.content || 'No analysis provided';
  } catch (error) {
    console.error('OpenRouter API error:', error);
    return 'Analysis failed due to API error';
  }
};

// Combine scraping and analysis
export const getAmazonAnalysis = async (asin: string) => {
  try {
    const { title, bulletPoints, description } = await scrapeAmazonPage(asin);
    
    const titleAnalysis = await analyzeText(`Product Title: ${title}`);
    const bulletAnalysis = await analyzeText(`Product Bullet Points: ${bulletPoints.join(' ')}`);
    const descriptionAnalysis = await analyzeText(`Product Description: ${description}`);

    return [
      `Title Analysis: ${titleAnalysis}`,
      `Bullet Points Analysis: ${bulletAnalysis}`,
      `Description Analysis: ${descriptionAnalysis}`
    ];
  } catch (error) {
    console.error('Analysis process error:', error);
    return ['Error analyzing product - please try again'];
  }
};
