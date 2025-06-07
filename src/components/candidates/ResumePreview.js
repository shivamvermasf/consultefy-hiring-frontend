// src/components/ResumePreview.js
import React from "react";
import { Typography, Box } from "@mui/material";

const ResumePreview = ({ pdfUrl }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Resume Preview</Typography>
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          title="PDF Preview"
          width="100%"
          height="500px"
          style={{ border: "none" }}
        />
      ) : (
        <Typography>No resume available to preview.</Typography>
      )}
    </Box>
  );
};

export default ResumePreview;
