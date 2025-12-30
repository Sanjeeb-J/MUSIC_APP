
import { GoogleGenAI, Type } from "@google/genai";
import { Song } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function searchSongs(query: string): Promise<Partial<Song>[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Find high-quality music metadata for search query: "${query}". Return the top 5 most relevant songs. Use your knowledge to provide accurate YouTube IDs.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            artist: { type: Type.STRING },
            album: { type: Type.STRING },
            duration: { type: Type.STRING },
            youtubeId: { type: Type.STRING },
            thumbnail: { type: Type.STRING, description: "URL of a high quality image" }
          },
          required: ["title", "artist", "youtubeId"]
        }
      }
    }
  });

  try {
    const results = JSON.parse(response.text || '[]');
    return results.map((r: any) => ({
      ...r,
      id: Math.random().toString(36).substr(2, 9),
      addedAt: Date.now(),
      youtubeUrl: `https://www.youtube.com/watch?v=${r.youtubeId}`,
      thumbnail: r.thumbnail || `https://img.youtube.com/vi/${r.youtubeId}/maxresdefault.jpg`
    }));
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
}

export async function getSuggestions(input: string): Promise<string[]> {
  if (input.length < 2) return [];
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Provide 5 autocomplete suggestions for a music search bar based on input: "${input}". Return just a string array of song or artist names.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch {
    return [];
  }
}
