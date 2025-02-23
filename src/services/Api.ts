import OpenAI from "openai";
import { TripDay, TripPreferences } from "../types";
import { Language } from "../translations";

const openai = new OpenAI({
  baseURL: import.meta.env.VITE_OPENAI_BASE_URL,
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});
async function getWikimediaImage(
  place: string,
  destination: string
): Promise<string | null> {
  try {
    const searchUrl = `https://cs.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=${encodeURIComponent(
      `${place} ${destination}`
    )}&utf8=1`;

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.query?.search?.[0]?.pageid) {
      const pageId = searchData.query.search[0].pageid;
      const imageUrl = `https://cs.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&piprop=original&pageids=${pageId}`;

      const imageResponse = await fetch(imageUrl);
      const imageData = await imageResponse.json();

      const image = imageData.query?.pages?.[pageId]?.original?.source;
      if (image) return image;
    }

    const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(
      `${place} ${destination}`
    )}&gsrlimit=1&prop=imageinfo&iiprop=url`;

    const commonsResponse = await fetch(commonsUrl);
    const commonsData = await commonsResponse.json();

    if (commonsData.query?.pages) {
      const firstPage = Object.values(commonsData.query.pages)[0] as any;
      return firstPage?.imageinfo?.[0]?.url || null;
    }

    return null;
  } catch (error) {
    console.error("Chyba při získávání obrázku:", error);
    return null;
  }
}
export async function generateTripPlan(
  destination: string,
  days: number,
  preferences: TripPreferences,
  language: Language
): Promise<TripDay[]> {
  try {
    const prompt =
      language === "en"
        ? `Create a ${days}-day itinerary for the destination ${destination} based on the following preferences:
- Interests: ${preferences.interests.join(", ")}
- Travel style: ${preferences.travelStyle}
- Season: ${preferences.season}
Include activities, places, and times that match the given preferences. For each location, provide its GPS coordinates and detailed information. If any information is unavailable or cannot be found, use the text "Not available".IMPORTANT:1. Use ONLY valid decimal numbers for coordinates (e.g. 50.123456)
2. All text must be in English
3. Use 24h time format (e.g. "14:30")
4. Respond ONLY with pure JSON without any additional text. Do not use markers like \`\`\` json or any other formatting. 
The output must be in JSON format matching this structure:
[{ 
  "day": number, 
  "activities": [{ 
    "time": string, 
    "place": string, 
    "description": string,
    "coordinates": { 
      "lat": number, 
      "lng": number 
    },
    "details": {
      "address": string,
      "openingHours": string,
      "imageUrl": string,
      "price": string,
      "website": string,
      "phone": string
    }
  }] 
}]
`
        : `Vytvoř ${days} denní itinerář pro destinaci ${destination} s následujícími preferencemi:
- Zájmy: ${preferences.interests.join(", ")}
- Styl cestování: ${preferences.travelStyle}
- Roční období: ${preferences.season}

Zahrň aktivity,místa a časy odpovídající zadaným preferencím. Pro každé místo přidej jeho GPS souřadnice a detailní informace.Pokud některá informace není dostupná nebo jí nenajdeš, použij text "Není k dispozici". 
DŮLEŽITÉ: 1. Používej POUZE platná desetinná čísla pro souřadnice (např. 50.123456)
2. Veškerý text musí být v češtině
3. Používej 24h formát času (např. "14:30")
4. Odpověz POUZE čistým JSON bez dalšího textu. Nepoužívej značky jako \`\`\`json nebo jiné formátování.
Výstup musí být v JSON formátu odpovídající struktuře:
[{ 
  "day": number, 
  "activities": [{ 
    "time": string, 
    "place": string, 
    "description": string,
    "coordinates": { 
      "lat": number, 
      "lng": number 
    },
    "details": {
      "address": string,
      "openingHours": string,
      "imageUrl": string,
      "price": string,
      "website": string,
      "phone": string
    }
  }] 
}]`;

    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            language === "en"
              ? "You are an experienced tour guide with knowledge of various travel styles and preferences. Respond in English."
              : "Jsi zkušený turistický průvodce se znalostí různých cestovatelských stylů a preferencí.",
        },
        { role: "user", content: prompt },
      ],
      model: "gpt-4o-mini",
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Prázdná odpověď od AI");

    const cleanJson = content
      .replace(/```json\s*/, "")
      .replace(/```\s*$/, "")
      .trim();

    const tripData = JSON.parse(cleanJson);

    for (const day of tripData) {
      for (const activity of day.activities) {
        try {
          const imageUrl = await getWikimediaImage(activity.place, destination);
          activity.details.imageUrl = imageUrl || "Není k dispozici";

          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
          console.error(
            `Chyba při získávání obrázku pro ${activity.place}:`,
            error
          );
          activity.details.imageUrl = "Není k dispozici";
        }
      }
    }

    return tripData;
  } catch (error) {
    console.error("Chyba při generování itineráře:", error);
    throw error;
  }
}
