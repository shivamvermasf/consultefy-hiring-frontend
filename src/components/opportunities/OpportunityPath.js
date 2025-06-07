import React from "react";
import { Stepper, Step, StepLabel } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { styled } from "@mui/material/styles";

const CustomStepIcon = styled("div")(({ theme, active, completed }) => ({
  width: 30,
  height: 30,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  backgroundColor: completed ? "#4caf50" : active ? "#1976d2" : "#cfd8dc",
  color: "#fff",
  fontSize: "14px",
  fontWeight: "bold",
}));

const OpportunityPath = ({ stages, currentStage }) => {
  const activeStep = stages.indexOf(currentStage);

  return (
    <Stepper alternativeLabel>
      {stages.map((stage, index) => (
        <Step key={stage} completed={index < activeStep}>
          <StepLabel
            StepIconComponent={() => (
              <CustomStepIcon active={index === activeStep} completed={index < activeStep}>
                {index < activeStep ? <CheckCircleIcon /> : index + 1}
              </CustomStepIcon>
            )}
          >
            {stage}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default OpportunityPath;
