import React, { useCallback, useState } from "react";
import { CircularProgress, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import config from "../config"; // Import the config file

const ResumeUpload = ({ onUpload }) => {
  const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress
  const [uploading, setUploading] = useState(false); // Track if uploading is in progress

  const onDrop = useCallback(async (acceptedFiles) => {
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);

    setUploading(true); // Start uploading
    setUploadProgress(0); // Reset the progress bar

    try {
      const res = await axios.post(`${config.API_BASE_URL}/upload/resume`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress); // Update the progress state
          }
        },
      });

      onUpload(res.data.fileUrl); // Return the uploaded file link to the parent
    } catch (error) {
      console.error("Resume upload failed", error);
      alert("❌ Resume upload failed. Please try again.");
    } finally {
      setUploading(false); // End uploading
    }
  }, [onUpload]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} style={{ border: "2px dashed gray", padding: "20px", textAlign: "center" }}>
      <input {...getInputProps()} />
      <p>Drag & drop a resume file here, or click to select</p>

      {uploading && (
        <div style={{ marginTop: "20px" }}>
          <CircularProgress variant="determinate" value={uploadProgress} />
          <Typography variant="body2" color="textSecondary" style={{ marginTop: "10px" }}>
            {uploadProgress}% Uploading...
          </Typography>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
