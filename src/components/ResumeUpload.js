import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const ResumeUpload = ({ onUpload }) => {
  const onDrop = useCallback(async (acceptedFiles) => {
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);

    const res = await axios.post("http://ec2-13-48-43-6.eu-north-1.compute.amazonaws.com:5001/api/upload/resume", formData);
    onUpload(res.data.resume_link);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} style={{ border: "2px dashed gray", padding: "20px", textAlign: "center" }}>
      <input {...getInputProps()} />
      <p>Drag & drop a resume file here, or click to select</p>
    </div>
  );
};

export default ResumeUpload;
