import { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import { translations, Language } from "../translations";

interface TripPreferences {
  budget: number;
  interests: string[];
  travelStyle: "budget" | "comfort" | "luxury";
  season: "spring" | "summer" | "autumn" | "winter";
}

interface TripFormProps {
  onSubmit: (formData: {
    destination: string;
    days: number;
    preferences: TripPreferences;
  }) => void;
  language: Language;
}

const TripForm = ({ onSubmit, language }: TripFormProps) => {
  const t = translations[language];
  const [formData, setFormData] = useState({
    destination: "",
    days: 1,
    preferences: {
      interests: [] as string[],
      travelStyle: "comfort",
      season: "summer",
    } as TripPreferences,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      ...(field.includes("preferences.")
        ? {
            preferences: {
              ...prev.preferences,
              [field.split(".")[1]]: value,
            },
          }
        : { [field]: value }),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Paper className="p-6 mb-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t.destination}
              value={formData.destination}
              onChange={(e) => handleChange("destination", e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label={t.numberOfDays}
              value={formData.days}
              onChange={(e) => handleChange("days", Number(e.target.value))}
              inputProps={{ min: 1, max: 30 }}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>{t.season}</InputLabel>
              <Select
                value={formData.preferences.season}
                onChange={(e) =>
                  handleChange("preferences.season", e.target.value)
                }
                label={t.season}
              >
                {Object.entries(t.seasons).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>{t.travelStyle}</InputLabel>
              <Select
                value={formData.preferences.travelStyle}
                onChange={(e) =>
                  handleChange("preferences.travelStyle", e.target.value)
                }
                label={t.travelStyle}
              >
                {Object.entries(t.travelStyles).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>{t.interests}</InputLabel>
              <Select
                multiple
                value={formData.preferences.interests}
                onChange={(e) =>
                  handleChange("preferences.interests", e.target.value)
                }
                label={t.interests}
              >
                {Object.entries(t.interestTypes).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 mt-4"
        >
          {t.planTrip}
        </Button>
      </form>
    </Paper>
  );
};

export default TripForm;
