import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_URL || "";
const genAI = new GoogleGenerativeAI(apiKey);

export class AIEvaluatorService {
  async evaluatePortfolio(portfolio: any[]) {
    if (!apiKey) {
      throw new Error("Gemini API Key is missing. Please set GEMINI_API_KEY in backend .env");
    }

    const totalValue = portfolio.reduce((sum, coin) => sum + (coin.value || 0), 0);
    const allocations = portfolio.map(coin => ({
      name: coin.name,
      percentage: ((coin.value / totalValue) * 100).toFixed(2) + "%"
    }));

    const prompt = `
      You are an expert crypto portfolio analyst.
      Analyze the following crypto portfolio:
      Total Portfolio Value: $${totalValue.toFixed(2)}
      Allocations: ${JSON.stringify(allocations)}
      
      Provide a strict JSON response (no markdown blocks, just raw JSON) with the following structure exactly:
      {
        "aiScore": <Number between 0-100 indicating overall portfolio quality/balance>,
        "riskLevel": "<String: 'Low', 'Moderate', or 'High'>",
        "analysis": "<String: 3 short sentences of qualitative analysis about their holdings and diversification>",
        "recommendations": [
          "<String: Actionable recommendation 1>",
          "<String: Actionable recommendation 2>"
        ],
        "volatility": "<String: e.g. '12.4%'>",
        "maxDrawdown": "<String: e.g. '-18.2%'>",
        "sharpeRatio": "<String: e.g. '1.36'>"
      }
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up potential markdown formatting from Gemini response
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(text);
  }
}
