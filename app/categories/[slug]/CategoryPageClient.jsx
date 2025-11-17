"use client";

import React, { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_PRODUCT_WITH_PAGINATION } from "@/app/schema/Product";
import {
  Box,
  Grid,
  Typography,
  Skeleton,
  Button,
  Card,
  CardMedia,
  Breadcrumbs,
  CardContent,
  Stack,
} from "@mui/material";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import WhyShopWithUs from "@/app/components/feature/WhyShopWithUs";

// URL slug → GraphQL enum
const categoryMap = {
  vegetable: "Vegetable",
  "snacks-breads": "Sneack_and_Bread",
  fruits: "Fruit",
  meats: "Meats",
  "milk-dairy": "Milk_and_Diary",
  seafood: "Seafood",
  drinks: "Drinks",
  "frozen-food": "Frozen_Food",
};

export default function CategoryPageClient({ slug }) {
  const { addToCart } = useCart();
  const categoryEnum = categoryMap[slug];

  const displayName = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const { loading, error, data, refetch } = useQuery(
    GET_PRODUCT_WITH_PAGINATION,
    {
      variables: {
        page: 1,
        limit: 20,
        pagination: true,
        keyword: "",
        category: categoryEnum,
      },
    }
  );

  useEffect(() => {
    if (categoryEnum) {
      refetch({
        page: 1,
        limit: 20,
        pagination: true,
        keyword: "",
        category: categoryEnum,
      });
    }
  }, [slug, categoryEnum, refetch]);

  const products = Array.isArray(data?.getProductWithPagination?.data)
    ? data.getProductWithPagination.data
    : [];

  return (
    <Box sx={{ py: 3, px: { xs: 1, sm: 2, md: 3 } }}>
      {/* Breadcrumb */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
        <Link href="/" style={{ textDecoration: "none", color: "#1976d2" }}>
          Home
        </Link>
        <Typography color="text.primary">{displayName}</Typography>
      </Breadcrumbs>

      {/* Title */}
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={3}
        sx={{ textTransform: "capitalize" }}
      >
        {displayName}
      </Typography>

      {/* Product Grid */}
      <Grid container spacing={2}>
        {/* Loading Skeleton */}
        {loading &&
          Array.from({ length: 10 }).map((_, i) => (
            <Grid key={i} item xs={6} sm={4} md={3} lg={2.4}>
              <Skeleton
                variant="rectangular"
                height={250}
                sx={{ borderRadius: 3 }}
              />
            </Grid>
          ))}

        {/* Error */}
        {error && (
          <Typography
            color="error"
            sx={{ gridColumn: "1/-1", width: "100%", textAlign: "center" }}
          >
            {error.message}
          </Typography>
        )}

        {/* No Products */}
        {!loading && !error && products.length === 0 && (
          <Typography
            sx={{ width: "100%", textAlign: "center", py: 4 }}
            color="text.secondary"
          >
            No products found in this category.
          </Typography>
        )}

        {/* Product Cards */}
        {!loading &&
          !error &&
          products.map((product) => (
            <Grid key={product.id} item xs={6} sm={6} md={3} lg={2.4}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 2,
                  overflow: "hidden",
                  height: "100%",
                  transition: "0.25s",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    boxShadow: 4,
                    transform: "translateY(-4px)",
                  },
                  p: 1,
                  height: 300,
                  width: 170,
                }}
              >
                <CardMedia
                  component="img"
                  height="130px"
                  image={product.imageUrl}
                  alt={product.productName}
                  sx={{
                    height: 160,
                    objectFit: "contain",
                    backgroundColor: "#fafafa",
                    p: 1,
                  }}
                />

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold" noWrap>
                    {product.productName}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      height: 36,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      mt: 0.5,
                    }}
                  >
                    {product.desc}
                  </Typography>

                  <Typography variant="h6" mt={1} color="success.main">
                    ${product.price?.toFixed(2) ?? "0.00"}
                  </Typography>
                </CardContent>

                <Box sx={{ p: 1 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    color="success"
                    onClick={() => addToCart(product)}
                    sx={{ borderRadius: 20, textTransform: "none" }}
                  >
                    🛒 Add to Cart
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
      </Grid>

      {/* Bottom Feature Section */}
      <Stack sx={{ mt: 6 }}>
        <WhyShopWithUs />
      </Stack>
    </Box>
  );
}
