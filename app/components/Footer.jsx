"use client";

import React from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";
import Image from "next/image";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Link from "next/link";

// Map display names → slugs
const categories = [
  { name: "Vegetables", slug: "vegetable" },
  { name: "Fruits", slug: "fruits" },
  { name: "Dairy", slug: "milk-dairy" },
  { name: "Meat & Fish", slug: "meats" },
  { name: "Snacks & Breads", slug: "snacks-breads" },
  { name: "Seafood", slug: "seafood" },
  { name: "Drinks", slug: "drinks" },
  { name: "Frozen Food", slug: "frozen-food" },
];

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      component="footer"
      sx={{
        p: 3,
        bgcolor: "#a6f8a6ff",
      }}
    >
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={isMobile ? 1 : 4}
        alignItems="center"
        justifyContent="center"
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Company Info */}
            <Grid item xs={12} sm={6} md={4}>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Image
                    src="/logos/grocery-cart.png"
                    alt="FreshMart Logo"
                    width={48}
                    height={48}
                    style={{
                      width: "auto",
                      height: "auto",
                      maxWidth: 48,
                      maxHeight: 48,
                      objectFit: "contain",
                    }}
                  />

                  <Typography variant="h6">FreshMart</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Your one-stop shop for fresh groceries delivered right to your
                  door.
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Payment Methods:
                  </Typography>
                  <Image
                    src="/payments/visa.png"
                    alt="Visa"
                    width={24}
                    height={24}
                    style={{
                      width: "auto",
                      height: "auto",
                      maxWidth: 24,
                      maxHeight: 24,
                      objectFit: "contain",
                    }}
                  />

                  <Image
                    src="/payments/card.png"
                    alt="Mastercard"
                    width={24}
                    height={24}
                    style={{
                      width: "auto",
                      height: "auto",
                      maxWidth: 24,
                      maxHeight: 24,
                      objectFit: "contain",
                    }}
                  />
                </Box>
              </Stack>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="h6" gutterBottom color="text.primary">
                Quick Links
              </Typography>
              {[
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
                { href: "/faq", label: "FAQ" },
                { href: "/career", label: "Careers" },
                { href: "/term&condition", label: "Terms & Conditions" },
                { href: "/privacy&policy", label: "Privacy Policy" },
              ].map((link) => (
                <Typography key={link.href} variant="body2" sx={{ mb: 1 }}>
                  <Link
                    href={link.href}
                    style={{ textDecoration: "none", color: "rgb(0, 121, 0)" }}
                  >
                    {link.label}
                  </Link>
                </Typography>
              ))}
            </Grid>

            {/* Categories */}
            <Grid item xs={6} sm={3} md={2}>
              <Typography variant="h6" gutterBottom color="text.primary">
                Categories
              </Typography>
              {categories.map((cat) => (
                <Typography key={cat.slug} variant="body2" sx={{ mb: 1 }}>
                  <Link
                    href={`/category/${cat.slug}`}
                    style={{ textDecoration: "none", color: "rgb(0, 121, 0)" }}
                  >
                    {cat.name}
                  </Link>
                </Typography>
              ))}
            </Grid>

            {/* Social Media */}
            <Grid item xs={12} sm={12} md={4}>
              <Typography variant="h6" gutterBottom color="text.primary">
                Connect with Us
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                {[
                  { src: "/media/facebook.png", alt: "Facebook" },
                  { src: "/media/twitter.png", alt: "Twitter" },
                  { src: "/media/instagram.png", alt: "Instagram" },
                  { src: "/media/telegram.png", alt: "Telegram" },
                ].map((social) => (
                  <IconButton key={social.alt}>
                    <Image
                      src={social.src}
                      alt={social.alt}
                      width={24}
                      height={24}
                    />
                  </IconButton>
                ))}
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Typography variant="body2" color="text.secondary" textAlign="center">
            &copy; {new Date().getFullYear()} FreshMart. All Rights Reserved.
          </Typography>
        </Container>
      </Stack>
    </Box>
  );
}
