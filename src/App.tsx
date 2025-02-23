import { useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import TripForm from "./components/TripForm";
import Itinerary from "./components/Itinerary";
import { TripDay, TripPreferences } from "./types";
import { generateTripPlan } from "./services/Api";
import { translations, Language } from "./translations";

function App() {
  const [itinerary, setItinerary] = useState<TripDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("cs");

  const handleTripSubmit = async (formData: {
    destination: string;
    days: number;
    preferences: TripPreferences;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const plan = await generateTripPlan(
        formData.destination,
        formData.days,
        formData.preferences,
        language
      );
      setItinerary(plan);
    } catch (err) {
      setError("Nepodařilo se vygenerovat itinerář");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <div className="flex justify-between items-center my-8">
        <Typography variant="h2" className="text-center">
          {translations[language].title}
        </Typography>
        <ToggleButtonGroup
          value={language}
          exclusive
          onChange={(_, newLang) => newLang && setLanguage(newLang)}
          aria-label="language"
          size="small"
        >
          <ToggleButton value="cs" aria-label="czech">
            🇨🇿
          </ToggleButton>
          <ToggleButton value="en" aria-label="english">
            🇬🇧
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <TripForm onSubmit={handleTripSubmit} language={language} />
      {error && (
        <Typography color="error" className="text-center my-4">
          {error}
        </Typography>
      )}
      {loading ? (
        <div className="flex justify-center my-8">
          <CircularProgress />
        </div>
      ) : (
        <Itinerary days={itinerary} language={language} />
      )}
    </Container>
  );
}

export default App;
