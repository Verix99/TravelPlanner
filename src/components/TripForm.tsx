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

interface TripPreferences {
  budget: number;
  activityLevel: "relaxed" | "moderate" | "active";
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
}

const FORM_OPTIONS = {
  activityLevels: [
    { value: "relaxed", label: "Relaxační" },
    { value: "moderate", label: "Střední" },
    { value: "active", label: "Aktivní" },
  ],
  interests: [
    { value: "culture", label: "Kultura a historie" },
    { value: "food", label: "Gastronomie" },
    { value: "nature", label: "Příroda" },
    { value: "shopping", label: "Nakupování" },
    { value: "sport", label: "Sport" },
    { value: "relax", label: "Wellness" },
  ],
  travelStyles: [
    { value: "budget", label: "Nízkonákladový" },
    { value: "comfort", label: "Standardní" },
    { value: "luxury", label: "Luxusní" },
  ],
  seasons: [
    { value: "spring", label: "Jaro" },
    { value: "summer", label: "Léto" },
    { value: "autumn", label: "Podzim" },
    { value: "winter", label: "Zima" },
  ],
} as const;

const TripForm = ({ onSubmit }: TripFormProps) => {
  const [formData, setFormData] = useState({
    destination: "",
    days: 1,
    preferences: {
      budget: 5000,
      activityLevel: "moderate",
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
              label="Destinace"
              value={formData.destination}
              onChange={(e) => handleChange("destination", e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Počet dní"
              value={formData.days}
              onChange={(e) => handleChange("days", Number(e.target.value))}
              inputProps={{ min: 1, max: 30 }}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Roční období</InputLabel>
              <Select
                value={formData.preferences.season}
                onChange={(e) =>
                  handleChange("preferences.season", e.target.value)
                }
                label="Roční období"
              >
                {FORM_OPTIONS.seasons.map(({ value, label }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Styl cestování</InputLabel>
              <Select
                value={formData.preferences.travelStyle}
                onChange={(e) =>
                  handleChange("preferences.travelStyle", e.target.value)
                }
                label="Styl cestování"
              >
                {FORM_OPTIONS.travelStyles.map(({ value, label }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Zájmy</InputLabel>
              <Select
                multiple
                value={formData.preferences.interests}
                onChange={(e) =>
                  handleChange("preferences.interests", e.target.value)
                }
                label="Zájmy"
              >
                {FORM_OPTIONS.interests.map(({ value, label }) => (
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
          Naplánovat cestu
        </Button>
      </form>
    </Paper>
  );
};

export default TripForm;
