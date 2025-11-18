"use client";
import React from "react";
import {
  Box,
  Typography,
  Grid,
  Stack,
  Avatar,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "iconsax-react";

const stores = [
  {
    id: 1,
    name: "J&T Express",
    logo: "/logos/j&t.jpg",
    cover: "/logos/j&t.jpg",
    delivery: "Delivery in 12 minutes",
  },
  {
    id: 2,
    name: "Grab",
    logo: "/logos/grab.png",
    cover: "/logos/grab.png",
    delivery: "Delivery in 15 minutes",
  },
  {
    id: 3,
    name: "FedEx",
    logo: "/logos/fedex.jpg",
    cover: "/logos/fedex.jpg",
    delivery: "Delivery in 10 minutes",
  },
];

function FeatureStore() {
  return (
    <Box sx={{ py: 3, px: { xs: 2, sm: 4 }, bgcolor: "background.paper" }}>
      <Stack sx={{ maxWidth: "1200px", mx: "auto" }}>
        {/* Header */}
        {/* <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 4 }}
        > */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            fontSize: 22,
            mb: 2,
            textAlign: { xs: "center", md: "left" },
          }}
        >
          Delivery & Pickup 🚛
        </Typography>

        {/* <Link href="/" style={{ textDecoration: "none" }}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: "primary.main" }}
              >
                Visit all Stores
              </Typography>
              <ArrowRight size="18" color="#7b1fa2" />
            </Stack>
          </Link> */}
        {/* </Stack> */}

        {/* Store Cards */}
        <Grid container spacing={3} justifyContent="center" gap={8}>
          {stores.map((store) => (
            <Grid item xs={12} sm={6} md={4} key={store.id}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 2,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: 4 },
                }}
              >
                <CardActionArea sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={store.cover}
                    alt={store.name}
                  />
                  <Avatar
                    src={store.logo}
                    alt={store.name}
                    sx={{
                      width: 56,
                      height: 56,
                      position: "absolute",
                      top: "55%",
                      left: "20%",
                      transform: "translate(-50%, -50%)",
                      border: "3px solid white",
                      boxShadow: 2,
                    }}
                  />
                  <CardContent sx={{ textAlign: "left" }}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      sx={{ fontWeight: "bold" }}
                    >
                      {store.name}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Image
                        src="/icons/light.png"
                        width={20}
                        height={20}
                        alt="Delivery Icon"
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {store.delivery}
                      </Typography>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
}

export default FeatureStore;
