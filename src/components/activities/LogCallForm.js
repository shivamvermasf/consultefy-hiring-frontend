// src/components/LogCallForm.js
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

const LogCallForm = ({ open, onClose, onSave }) => {
  const [subject, setSubject] = useState("");
  const [comments, setComments] = useState("");

  const handleSave = () => {
    const newActivity = {
      activity_type: "Call",
      subject,
      description: comments,
      status: "Completed"
    };
    onSave(newActivity);
    // After save, close the modal (it will slide down and disappear)
    onClose();
    // Reset fields
    setSubject("");
    setComments("");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      fullWidth
      maxWidth="sm" // Smaller width
      PaperProps={{
        sx: {
          height: "50vh", // Smaller height
          overflowY: "auto"
        }
      }}
    >
      <DialogTitle>Log a Call</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          fullWidth
        />
        <TextField
          label="Comments"
          multiline
          minRows={4}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          fullWidth
          placeholder="Enter detailed call notes..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogCallForm;
