// src/components/CandidateDetails.js
import React from "react";
import { Typography, Box, Button, Grid, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CandidateDetails = ({ candidate }) => {
  const navigate = useNavigate();

  if (!candidate) {
    return <Typography>No candidate data available.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Candidate Details</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box sx={{ width: '50%' }}>
            <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
            <Typography variant="body1">{candidate.phone}</Typography>
          </Box>
          <Box sx={{ width: '50%' }}>
            <Typography variant="subtitle2" color="textSecondary">Email</Typography>
            <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>{candidate.email}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box sx={{ width: '50%' }}>
            <Typography variant="subtitle2" color="textSecondary">Location</Typography>
            <Typography variant="body1">{candidate.location || "Not Provided"}</Typography>
          </Box>
          <Box sx={{ width: '50%' }}>
            <Typography variant="subtitle2" color="textSecondary">Experience</Typography>
            <Typography variant="body1">{candidate.experience} years</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box sx={{ width: '50%' }}>
            <Typography variant="subtitle2" color="textSecondary">Current Salary</Typography>
            <Typography variant="body1">
              {candidate.current_salary
                ? `$${candidate.current_salary.toLocaleString()}`
                : "Not Provided"}
            </Typography>
          </Box>
          <Box sx={{ width: '50%' }}>
            <Typography variant="subtitle2" color="textSecondary">Expected Salary</Typography>
            <Typography variant="body1">
              {candidate.expected_salary
                ? `$${candidate.expected_salary.toLocaleString()}`
                : "Not Provided"}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box sx={{ width: '50%' }}>
            <Typography variant="subtitle2" color="textSecondary">Notice Period</Typography>
            <Typography variant="body1">{candidate.notice_period || "Not Provided"}</Typography>
          </Box>
          <Box sx={{ width: '50%' }}>
            <Typography variant="subtitle2" color="textSecondary">Status</Typography>
            <Typography variant="body1">{candidate.status || "Not Provided"}</Typography>
          </Box>
        </Box>

        <Box sx={{ width: '100%' }}>
          <Typography variant="subtitle2" color="textSecondary">Skills</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {candidate.skills ? (
              (() => {
                let skillsArray;
                if (typeof candidate.skills === 'string') {
                  try {
                    // Try to parse if it's a JSON string
                    skillsArray = JSON.parse(candidate.skills);
                  } catch (e) {
                    // If not JSON, split by comma
                    skillsArray = candidate.skills.split(',').map(s => s.trim());
                  }
                } else if (Array.isArray(candidate.skills)) {
                  skillsArray = candidate.skills;
                } else {
                  return (
                    <Typography variant="body2" color="text.secondary">
                      No skills listed
                    </Typography>
                  );
                }

                return skillsArray.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    size="small"
                    sx={{
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                      '& .MuiChip-label': {
                        px: 1,
                      },
                    }}
                  />
                ));
              })()
            ) : (
              <Typography variant="body2" color="text.secondary">
                No skills listed
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
      <Button
        variant="outlined"
        onClick={() => navigate(`/edit-candidate/${candidate.id}`)}
        sx={{ mt: 2 }}
      >
        Edit/Update Candidate
      </Button>
    </Box>
  );
};

export default CandidateDetails;
