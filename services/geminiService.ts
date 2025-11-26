
import { GoogleGenAI, Type } from "@google/genai";
import { Restaurant, AIRecommendationResponse } from "../types";

// Safety wrapper to access process.env without crashing in browsers
const getApiKey = () => {
  try {
    // @ts-ignore
    return process.env.API_KEY;
  } catch (e) {
    return undefined;
  }
};

const apiKey = getApiKey();
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

/**
 * Uses Gemini to find the best matching restaurants based on a natural language query.
 * This acts as a Semantic Search Engine.
 */
export const searchRestaurantsWithGemini = async (
  query: string,
  availableRestaurants: Restaurant[]
): Promise<AIRecommendationResponse | null> => {
  if (!ai) {
    console.warn("Gemini API Key not found. AI features disabled.");
    return null;
  }

  try {
    // Prepare the data context for the model
    const restaurantContext = availableRestaurants.map(r => ({
      id: r.id,
      name: r.name,
      cuisine: r.cuisine.join(", "),
      price: r.priceForTwo,
      rating: r.rating,
      location: r.location,
      healthScore: r.healthScore
    }));

    const model = "gemini-2.5-flash";
    
    const response = await ai.models.generateContent({
      model,
      contents: `User Query: "${query}"
      
      Available Restaurants Data:
      ${JSON.stringify(restaurantContext)}
      
      Task: Analyze the user's query and the available restaurants. 
      Consider Health Score (out of 100) if user mentions "healthy" or "clean".
      Return a JSON object containing:
      1. 'restaurantIds': An array of strings of the IDs of the restaurants that best match the query. Sort by relevance.
      2. 'message': A short, witty, helpful message (max 1 sentence) explaining why you chose these.
      
      If no restaurants match well, return an empty array for IDs and a polite message suggesting something else available in the list.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            restaurantIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            message: { type: Type.STRING }
          },
          required: ["restaurantIds", "message"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text) as AIRecommendationResponse;
      return data;
    }
    return null;

  } catch (error) {
    console.error("Gemini Search Error:", error);
    return {
      restaurantIds: [],
      message: "I'm having a bit of trouble connecting to the food network right now."
    };
  }
};
