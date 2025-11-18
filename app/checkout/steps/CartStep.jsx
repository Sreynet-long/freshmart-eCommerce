"use client";
import React from "react";
import {
  Stack,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCart } from "@/app/context/CartContext";

export default function CartStep() {
  const { cart, removeItem, updateQuantity } = useCart();

  if (!cart || cart.length === 0)
    return <Typography>Your cart is empty.</Typography>;

  return (
    <Stack spacing={2}>
      {cart.map((item) => (
        <Card
          key={item.product.id || item.product._id}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            alignItems: "center",
            p: 1,
          }}
        >
          <CardMedia
            component="img"
            image={item.product.imageUrl || "/default-product.png"}
            alt={item.product.productName}
            sx={{
              width: { xs: "100%", sm: 96 },
              height: 96,
              objectFit: "cover",
              borderRadius: 1,
            }}
          />

          <CardContent sx={{ flex: 1, py: 1 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="subtitle1">{item.product.productName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.quantity} × ${Number(item.product.price ?? 0).toFixed(2)}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" sx={{ minWidth: 60, textAlign: "right" }}>
                  ${(item.quantity * (item.product.price ?? 0)).toFixed(2)}
                </Typography>
                <IconButton color="error" onClick={() => removeItem(item.product.id || item.product._id)}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}

      <Divider />

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Typography variant="subtitle1">
          Subtotal: $
          {cart
            .reduce((s, it) => s + (it.product.price ?? 0) * (it.quantity ?? 1), 0)
            .toFixed(2)}
        </Typography>
      </Box>
    </Stack>
  );
}
