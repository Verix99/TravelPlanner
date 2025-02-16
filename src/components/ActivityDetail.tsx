import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
} from "@mui/material";
import { Activity } from "../types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

interface ActivityDetailProps {
  activity: Activity;
}

const ActivityDetail = ({ activity }: ActivityDetailProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton size="small" onClick={() => setIsOpen(true)} className="ml-2">
        <ExpandMoreIcon />
      </IconButton>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center">
          {activity.place}
        </DialogTitle>
        <DialogContent>
          {activity.details?.imageUrl && (
            <img
              src={activity.details.imageUrl}
              alt={activity.place}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          )}
          <div className="space-y-2">
            <Typography variant="body1">
              <strong>Čas návštěvy:</strong> {activity.time}
            </Typography>
            <Typography variant="body1">
              <strong>Popis:</strong> {activity.description}
            </Typography>
            {activity.details && (
              <>
                <Typography variant="body1">
                  <strong>Adresa:</strong> {activity.details.address}
                </Typography>
                <Typography variant="body1">
                  <strong>Otevírací doba:</strong>{" "}
                  {activity.details.openingHours}
                </Typography>
                {activity.details.price && (
                  <Typography variant="body1">
                    <strong>Vstupné:</strong> {activity.details.price}
                  </Typography>
                )}
                {activity.details.website &&
                activity.details.website !== "Není k dispozici" ? (
                  <Typography variant="body1">
                    <strong>Web:</strong>{" "}
                    <a
                      href={activity.details.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {activity.details.website}
                    </a>
                  </Typography>
                ) : (
                  activity.details.website && (
                    <Typography variant="body1">
                      <strong>Web:</strong> {activity.details.website}
                    </Typography>
                  )
                )}
                {activity.details.phone && (
                  <Typography variant="body1">
                    <strong>Telefon:</strong> {activity.details.phone}
                  </Typography>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ActivityDetail;
