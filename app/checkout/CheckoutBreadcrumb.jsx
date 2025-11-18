"use client";
import React from "react";
import { Breadcrumbs, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export default function CheckoutBreadcrumb({ activeStep = 0 }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fullSteps = ["Cart", "Shipping Information", "Payment Method"];
  const shortSteps = ["Cart", "Ship", "Pay"];

  const labels = isMobile ? shortSteps : fullSteps;

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
      sx={{ mb: { xs: 2, md: 3 } }}
    >
      {labels.map((label, i) =>
        i === activeStep ? (
          <Typography key={label} color="primary" sx={{ fontWeight: 600 }}>
            {label}
          </Typography>
        ) : (
          <Typography key={label} color="text.secondary">
            {label}
          </Typography>
        )
      )}
    </Breadcrumbs>
  );
}
