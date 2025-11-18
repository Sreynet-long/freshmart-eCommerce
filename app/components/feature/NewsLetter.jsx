"use client";
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Stack,
  TextField,
  Button,
  Box,
} from "@mui/material";

export default function Newsletter() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSubscribe = () => {
    if (!email) return;
    alert(`Subscribed with: ${email}`);
    setEmail("");
  };

  return (
    <Box
      display="flex"
      sx={{
        textAlign: "center",
        py: 6,
        bgcolor: "#cee6d0ff",
        borderTopRightRadius: { xs: "80px", sm: "170px" },
        borderTopLeftRadius: { xs: "80px", sm: "170px" },
        mt: "15px",
      }}
    >
      <Stack sx={{ maxWidth: "1200px", mx: "auto", px: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Stay Updated
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Subscribe to our newsletter for fresh deals and weekly offers.
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          <TextField
            id="newsletter-email"
            label="Enter your email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              borderRadius: "27px",
              width: { xs: "100%", sm: "450px" },
            }}
          />
          <Button
            onClick={handleSubscribe}
            variant="contained"
            color="success"
            sx={{
              px: { xs: 4, sm: 6 },
              py: { xs: 1.5, sm: 2 },
              borderRadius: "25px",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <span role="img" aria-label="bell">
              🔔
            </span>{" "}
            Subscribe
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
