import { useState } from "react";
import { Container, Typography, CircularProgress } from "@mui/material";
import TripForm from "./components/TripForm";
import Itinerary from "./components/Itinerary";
import { TripDay, TripPreferences } from "./types";
import { generateTripPlan } from "./services/Api";

function App() {
  const [itinerary, setItinerary] = useState<TripDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        formData.preferences
      );
      setItinerary(plan);
      // const plan = mockTripData;
      // setItinerary(plan);
    } catch (err) {
      setError("Nepodařilo se vygenerovat itinerář");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h2" className="text-center my-8">
        AI Travel Planner
      </Typography>
      <TripForm onSubmit={handleTripSubmit} />
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
        <Itinerary days={itinerary} />
      )}
    </Container>
  );
}

export default App;
