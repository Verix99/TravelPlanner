// import { Paper, Typography, Divider } from "@mui/material";
// import { Activity } from "../types";
// import DayMap from "./DayMap";

// interface ItineraryProps {
//   days: {
//     day: number;
//     activities: Activity[];
//   }[];
// }

// const Itinerary = ({ days }: ItineraryProps) => {
//   if (!days.length) return null;

//   return (
//     <Paper className="p-6">
//       <Typography variant="h4" className="mb-4">
//         Váš itinerář
//       </Typography>
//       {days.map((day) => (
//         <div key={day.day} className="mb-6">
//           <Typography variant="h5" className="mb-3">
//             Den {day.day}
//           </Typography>
//           {day.activities.map((activity, index) => (
//             <div key={index} className="mb-2">
//               <Typography variant="subtitle1" className="font-bold">
//                 {activity.time} - {activity.place}
//               </Typography>
//               <Typography>{activity.description}</Typography>
//               <Divider className="my-2" />
//             </div>
//           ))}
//           <DayMap activities={day.activities} />
//         </div>
//       ))}
//     </Paper>
//   );
// };

// export default Itinerary;
import { Paper, Typography, Divider } from "@mui/material";
import { Activity } from "../types";
import DayMap from "./DayMap";
import ActivityDetail from "./ActivityDetail";

interface ItineraryProps {
  days: {
    day: number;
    activities: Activity[];
  }[];
}

const Itinerary = ({ days }: ItineraryProps) => {
  if (!days.length) return null;

  return (
    <Paper className="p-6">
      <Typography variant="h4" className="mb-4">
        Váš itinerář
      </Typography>
      {days.map((day) => (
        <div key={day.day} className="mb-6">
          <Typography variant="h5" className="mb-3">
            Den {day.day}
          </Typography>
          {day.activities.map((activity, index) => (
            <div key={index} className="mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold"
                  style={{ minWidth: "24px" }}
                >
                  {index + 1}
                </div>
                <Typography variant="subtitle1" className="font-bold">
                  {activity.time} - {activity.place}
                </Typography>
                <ActivityDetail activity={activity} />
              </div>
              <Typography className="ml-8">{activity.description}</Typography>
              <Divider className="my-2" />
            </div>
          ))}
          <DayMap activities={day.activities} />
        </div>
      ))}
    </Paper>
  );
};
export default Itinerary;
