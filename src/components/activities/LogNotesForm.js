import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Slide
} from "@mui/material";

// Transition component to slide up from bottom
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LogNotesForm = ({ open, onClose, onSave }) => {
  const [subject, setSubject] = useState("");
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    const newActivity = {
      activity_type: "Note",
      subject,
      description: notes,
      status: "Completed"
    };
    onSave(newActivity);
    onClose();
    // Reset fields
    setSubject("");
    setNotes("");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          height: "50vh",
          overflowY: "auto"
        }
      }}
    >
      <DialogTitle>Log Notes</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          fullWidth
        />
        <TextField
          label="Notes"
          multiline
          minRows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          fullWidth
          placeholder="Enter your notes here..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogNotesForm; 