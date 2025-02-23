import { useEffect, useRef } from "react";
import L, { LatLngTuple } from "leaflet";
import { Activity } from "../types";
import { Button, Stack } from "@mui/material";
import MapIcon from "@mui/icons-material/Map";

interface DayMapProps {
  activities: Activity[];
}

const DayMap = ({ activities }: DayMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  const handleExportToGoogleMaps = () => {
    const activitiesWithCoords = activities.filter(
      (activity) => activity.coordinates
    );
    if (activitiesWithCoords.length === 0) return;

    const waypoints = activitiesWithCoords
      .map(
        (activity) =>
          `${activity.coordinates!.lat},${activity.coordinates!.lng}`
      )
      .join("/");

    const url = `https://www.google.com/maps/dir/${waypoints}/data=!3m1!4b1!4m2!4m1!3e2`;
    window.open(url, "_blank");
  };

  useEffect(() => {
    if (!mapRef.current || !activities.length) return;

    const activitiesWithCoords = activities.filter(
      (
        activity
      ): activity is Activity & {
        coordinates: NonNullable<Activity["coordinates"]>;
      } => activity.coordinates !== undefined
    );

    if (activitiesWithCoords.length === 0) return;

    const map = L.map(mapRef.current).setView(
      [
        activitiesWithCoords[0].coordinates.lat,
        activitiesWithCoords[0].coordinates.lng,
      ],
      13
    );

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }
    ).addTo(map);

    const points: LatLngTuple[] = activitiesWithCoords.map((activity) => [
      activity.coordinates.lat,
      activity.coordinates.lng,
    ]);

    L.polyline(points, {
      color: "#3b82f6",
      weight: 4,
      opacity: 0.8,
      lineJoin: "round",
    }).addTo(map);

    activitiesWithCoords.forEach((activity, index) => {
      const customIcon = L.divIcon({
        className: "custom-div-icon",
        html: `<div style="
          background-color: #3b82f6;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ">${index + 1}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      L.marker([activity.coordinates.lat, activity.coordinates.lng], {
        icon: customIcon,
      })
        .bindPopup(
          `
           <div class="min-w-[200px] p-2">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-lg font-bold">${activity.place}</h3>
        </div>
        <p class="font-medium text-gray-600">${activity.time}</p>
        <p class="text-sm mt-1">${activity.description}</p>
      </div>
        `,
          {
            closeButton: true,
            className: "custom-popup",
          }
        )
        .addTo(map);
    });

    return () => {
      map.remove();
    };
  }, [activities]);

  return (
    <div className="space-y-4">
      <div ref={mapRef} className="w-full h-[400px] rounded-lg shadow-lg" />
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          startIcon={<MapIcon />}
          onClick={handleExportToGoogleMaps}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Otevřít v Google Maps
        </Button>
      </Stack>
    </div>
  );
};

export default DayMap;
