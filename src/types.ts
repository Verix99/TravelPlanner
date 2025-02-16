export interface TripPreferences {
  budget: number;
  activityLevel: "relaxed" | "moderate" | "active";
  interests: string[];
  travelStyle: "budget" | "comfort" | "luxury";
  season: "spring" | "summer" | "autumn" | "winter";
}

export interface PlaceDetails {
  imageUrl?: string;
  address: string;
  openingHours: string;
  price?: string;
  website?: string;
  phone?: string;
  activityType?: string[];
  priceLevel?: "budget" | "comfort" | "luxury";
}

export interface Activity {
  time: string;
  place: string;
  description: string;
  details?: PlaceDetails;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface TripDay {
  day: number;
  activities: Activity[];
}

export interface TripPlan {
  destination: string;
  days: TripDay[];
}
