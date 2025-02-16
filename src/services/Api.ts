import OpenAI from "openai";
import { TripDay, TripPreferences } from "../types";

const openai = new OpenAI({
  baseURL: import.meta.env.VITE_OPENAI_BASE_URL,
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateTripPlan(
  destination: string,
  days: number,
  preferences: TripPreferences
): Promise<TripDay[]> {
  try {
    const prompt = `Vytvoř ${days} denní itinerář pro destinaci ${destination} s následujícími preferencemi:
- Zájmy: ${preferences.interests.join(", ")}
- Styl cestování: ${preferences.travelStyle}
- Roční období: ${preferences.season}

Zahrň aktivity,místa a časy odpovídající zadaným preferencím. Pro každé místo přidej jeho GPS souřadnice a detailní informace.Pokud některá informace není dostupná, použij text "Není k dispozici". 
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
            "Jsi zkušený turistický průvodce se znalostí různých cestovatelských stylů a preferencí.",
        },
        { role: "user", content: prompt },
      ],
      model: "o3-mini",
    });
    console.log(prompt);

    const content = response.choices[0].message.content;
    console.log(content);
    if (!content) throw new Error("Prázdná odpověď od AI");

    return JSON.parse(content);
  } catch (error) {
    console.error("Chyba při generování itineráře:", error);
    throw error;
  }
}
