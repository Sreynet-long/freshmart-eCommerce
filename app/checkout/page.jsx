"use client";
import React, { lazy, Suspense, useState } from "react";
import { Box, CircularProgress, Button, Stack } from "@mui/material";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { useMutation } from "@apollo/client/react";
import { CREATE_ORDER } from "../schema/Order";
import { useRouter } from "next/navigation";
import CheckoutBreadcrumb from "./CheckoutBreadcrumb";
import OrderSuccess from "./OrderSuccess";

const CartStep = lazy(() => import("./steps/CartStep"));
const ShippingStep = lazy(() => import("./steps/ShippingStep"));
const PaymentStep = lazy(() => import("./steps/PaymentStep"));

const steps = ["Cart", "Shipping", "Payment"];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { user, setAlert } = useAuth();
  const [createOrder] = useMutation(CREATE_ORDER);

  const [activeStep, setActiveStep] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    country: "Cambodia",
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const nextStep = () =>
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const handlePayNow = async () => {
    if (!user) {
      setAlert(true, "error", {
        messageEn: "Please login first",
        messageKh: "",
      });
      router.push("/auth");
      return;
    }

    const orderInput = {
      userId: user.id,
      shippingInfo,
      items: cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      paymentMethod,
    };

    try {
      setLoading(true);
      const { data } = await createOrder({ variables: { input: orderInput } });
      if (data?.createOrder?.isSuccess) {
        setAlert(true, "success", {
          messageEn: "Order placed successfully!",
          messageKh: "",
        });
        clearCart();
        setShowSuccess(true);
      }
    } catch (err) {
      console.error(err);
      setAlert(true, "error", {
        messageEn: "Checkout failed.",
        messageKh: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <CartStep />;
      case 1:
        return (
          <ShippingStep
            shippingInfo={shippingInfo}
            setShippingInfo={setShippingInfo}
          />
        );
      case 2:
        return (
          <PaymentStep
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            handlePayNow={handlePayNow}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        maxWidth: "lg",
        mx: "auto",
        minHeight: "60vh",
      }}
    >
      {/* Breadcrumb */}
      <CheckoutBreadcrumb activeStep={activeStep} />

      {/* Step content or Success page */}
      <Suspense
        fallback={
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        }
      >
        {showSuccess ? <OrderSuccess /> : renderStep()}
      </Suspense>

      {/* Navigation buttons (hide if success) */}
      {!showSuccess && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          mt={3}
          justifyContent="flex-end"
        >
          <Button
            disabled={activeStep === 0}
            onClick={prevStep}
            fullWidth={{ xs: true, sm: false }}
          >
            Back
          </Button>

          {activeStep < steps.length - 1 && (
            <Button
              variant="contained"
              onClick={nextStep}
              fullWidth={{ xs: true, sm: false }}
            >
              Next
            </Button>
          )}
        </Stack>
      )}
    </Box>
  );
}
