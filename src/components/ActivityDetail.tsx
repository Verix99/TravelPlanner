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
import { translations, Language } from "../translations";
import CloseIcon from "@mui/icons-material/Close";

interface ActivityDetailProps {
  activity: Activity;
  language: Language;
}

const ActivityDetail = ({ activity, language }: ActivityDetailProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = translations[language];

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
          <IconButton
            aria-label="close"
            onClick={() => setIsOpen(false)}
            size="small"
          >
            <CloseIcon />
          </IconButton>
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
              <strong>{t.timeVisit}:</strong> {activity.time}
            </Typography>
            <Typography variant="body1">
              <strong>{t.description}:</strong> {activity.description}
            </Typography>
            {activity.details && (
              <>
                <Typography variant="body1">
                  <strong>{t.address}:</strong> {activity.details.address}
                </Typography>
                <Typography variant="body1">
                  <strong>{t.openingHours}:</strong>{" "}
                  {activity.details.openingHours}
                </Typography>
                {activity.details.price && (
                  <Typography variant="body1">
                    <strong>{t.price}:</strong> {activity.details.price}
                  </Typography>
                )}
                {activity.details.website &&
                activity.details.website !== "Není k dispozici" ? (
                  <Typography variant="body1">
                    <strong>{t.website}:</strong>{" "}
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
                      <strong>{t.website}:</strong> {activity.details.website}
                    </Typography>
                  )
                )}
                {activity.details.phone && (
                  <Typography variant="body1">
                    <strong>{t.phone}:</strong> {activity.details.phone}
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
