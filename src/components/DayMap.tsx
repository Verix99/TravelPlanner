// import { useEffect, useRef } from "react";
// import L, { LatLngTuple } from "leaflet";
// import { Activity } from "../types";
// import { Button } from "@mui/material";
// import MapIcon from "@mui/icons-material/Map";

// interface DayMapProps {
//   activities: Activity[];
// }

// const DayMap = ({ activities }: DayMapProps) => {
//   const mapRef = useRef<HTMLDivElement>(null);
//   const handleExportToGoogleMaps = () => {
//     const activitiesWithCoords = activities.filter(
//       (activity) => activity.coordinates
//     );

//     if (activitiesWithCoords.length === 0) return;

//     // Vytvoření URL pro Google Maps s trasou
//     const waypoints = activitiesWithCoords
//       .map(
//         (activity) =>
//           `${activity.coordinates!.lat},${activity.coordinates!.lng}`
//       )
//       .join("/");

//     const url = `https://www.google.com/maps/dir/${waypoints}/data=!4m2!4m1!3e2!5m1!1e1!5m1!1e4`;

//     // Otevření v novém okně
//     window.open(url, "_blank");
//   };

//   useEffect(() => {
//     console.log("Activities:", activities);
//     if (!mapRef.current || !activities.length) return;

//     // Filtrujeme aktivity, které mají souřadnice
//     const activitiesWithCoords = activities.filter(
//       (
//         activity
//       ): activity is Activity & {
//         coordinates: NonNullable<Activity["coordinates"]>;
//       } => activity.coordinates !== undefined
//     );
//     console.log("Activities with coords:", activitiesWithCoords);

//     if (activitiesWithCoords.length === 0) return;

//     // Vytvoření mapy
//     const map = L.map(mapRef.current).setView(
//       [
//         activitiesWithCoords[0].coordinates.lat,
//         activitiesWithCoords[0].coordinates.lng,
//       ],
//       13
//     );

//     // Přidání OpenStreetMap vrstvy
//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       attribution:
//         '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//       maxZoom: 18, // Maximální úroveň zoomu
//     }).addTo(map);

//     // Vytvoření trasy mezi body s explicitním typováním
//     const points: LatLngTuple[] = activitiesWithCoords.map((activity) => [
//       activity.coordinates.lat,
//       activity.coordinates.lng,
//     ]);

//     L.polyline(points, { color: "red" }).addTo(map);

//     // Přidání markerů
//     activitiesWithCoords.forEach((activity) => {
//       L.marker([activity.coordinates.lat, activity.coordinates.lng])
//         .bindPopup(
//           `
//           <div>
//             <h3>${activity.place}</h3>
//             <p><strong>${activity.time}</strong></p>
//             <p>${activity.description}</p>
//           </div>
//         `
//         )
//         .addTo(map);
//     });

//     return () => {
//       map.remove();
//     };
//   }, [activities]);

//   return (
//     // <div ref={mapRef} className="w-full h-[400px] mt-4 rounded-lg shadow-lg" />
//     <div className="space-y-4">
//       <div ref={mapRef} className="w-full h-[400px] rounded-lg shadow-lg" />
//       <Button
//         variant="contained"
//         startIcon={<MapIcon />}
//         onClick={handleExportToGoogleMaps}
//         className="w-full bg-blue-600 hover:bg-blue-700"
//       >
//         Otevřít v Google Maps
//       </Button>
//     </div>
//   );
// };

// export default DayMap;
// src/components/DayMap.tsx
import { useEffect, useRef } from "react";
import L, { LatLngTuple } from "leaflet";
import { Activity } from "../types";
import { Button, Stack } from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

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

    // Vytvoření URL pro Google Maps s trasou
    const waypoints = activitiesWithCoords
      .map(
        (activity) =>
          `${activity.coordinates!.lat},${activity.coordinates!.lng}`
      )
      .join("/");

    const url = `https://www.google.com/maps/dir/${waypoints}/data=!3m1!4b1!4m2!4m1!3e2`;
    window.open(url, "_blank");
  };
  const handleExportToCalendar = () => {
    const events = activities.map((activity) => {
      // Převedení času na ISO formát
      const today = new Date();
      const [hours, minutes] = activity.time.split(":");
      const startTime = new Date(
        today.setHours(Number(hours), Number(minutes), 0)
      );
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // +1 hodina

      // Formátování data pro Google Calendar
      const formatDate = (date: Date) => {
        return date
          .toISOString()
          .replace(/-|:|\.\d\d\d/g, "")
          .slice(0, -1);
      };

      const event = {
        text: encodeURIComponent(activity.place),
        details: encodeURIComponent(
          `${activity.description}\n\nAdresa: ${
            activity.details?.address || "Není k dispozici"
          }`
        ),
        location: encodeURIComponent(activity.details?.address || ""),
        dates: `${formatDate(startTime)}/${formatDate(endTime)}`,
      };

      // Vytvoření Google Calendar URL
      return (
        `https://www.google.com/calendar/render?action=TEMPLATE` +
        `&text=${event.text}` +
        `&details=${event.details}` +
        `&location=${event.location}` +
        `&dates=${event.dates}`
      );
    });

    // Otevření všech událostí v nových oknech
    events.forEach((eventUrl) => {
      window.open(eventUrl, "_blank");
    });
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

    // Vytvoření mapy
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
            <h3 class="text-lg font-bold mb-2">${activity.place}</h3>
            <p class="font-medium text-gray-600">${activity.time}</p>
            <p class="text-sm mt-1">${activity.description}</p>
          </div>
        `,
          {
            closeButton: false,
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
        <Button
          variant="contained"
          startIcon={<CalendarMonthIcon />}
          onClick={handleExportToCalendar}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          Exportovat do kalendáře
        </Button>
      </Stack>
    </div>
  );
};

export default DayMap;
