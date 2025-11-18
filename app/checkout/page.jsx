"use client";
import React, { lazy, Suspense, useState } from "react";
import {
  Box,
  CircularProgress,
  Button,
  Stack,
  Stepper,
  Step,
  StepLabel,
  useMediaQuery,
  Paper,
  Fade,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { useMutation } from "@apollo/client/react";
import { CREATE_ORDER } from "@/app/schema/Order";
import CheckoutBreadcrumb from "./CheckoutBreadcrumb";

const CartStep = lazy(() => import("./steps/CartStep"));
const ShippingStep = lazy(() => import("./steps/ShippingStep"));
const PaymentStep = lazy(() => import("./steps/PaymentStep"));
const OrderSuccess = lazy(() => import("./OrderSuccess"));

const steps = ["Cart", "Shipping", "Payment"];

export default function CheckoutPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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
  const [validationError, setValidationError] = useState("");

  const nextStep = () => {
    // Basic validation before moving from Shipping -> Payment
    if (activeStep === 1) {
      const required = ["name", "phone", "address"];
      for (const k of required) {
        if (!String(shippingInfo[k] || "").trim()) {
          setValidationError("Please fill in your name, phone and address.");
          return;
        }
      }
    }
    setValidationError("");
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };
  const prevStep = () => {
    setValidationError("");
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handlePayNow = async () => {
    if (!user) {
      setAlert?.(true, "error", {
        messageEn: "Please login first",
        messageKh: "",
      });
      return;
    }

    if (!cart || cart.length === 0) {
      setAlert?.(true, "error", {
        messageEn: "Your cart is empty",
        messageKh: "",
      });
      return;
    }

    setValidationError("");
    const orderInput = {
      userId: user.id,
      shippingInfo,
      items: cart.map((item) => ({
        productId: item.product.id || item.product._id,
        quantity: item.quantity,
      })),
      paymentMethod,
    };

    try {
      setLoading(true);
      const { data } = await createOrder({ variables: { input: orderInput } });
      if (data?.createOrder?.isSuccess) {
        setAlert?.(true, "success", {
          messageEn: "Order placed successfully!",
          messageKh: "",
        });
        clearCart();
        setShowSuccess(true);
      } else {
        setAlert?.(true, "error", {
          messageEn: data?.createOrder?.message || "Checkout failed.",
          messageKh: "",
        });
      }
    } catch (err) {
      console.error(err);
      setAlert?.(true, "error", {
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
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1000, mx: "auto" }}>
      <CheckoutBreadcrumb activeStep={activeStep} />

      <Paper
        elevation={1}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
        }}
      >
        {!showSuccess && (
          <Stepper
            activeStep={activeStep}
            alternativeLabel={!isMobile}
            orientation={isMobile ? "vertical" : "horizontal"}
            sx={{ mb: { xs: 2, md: 3 } }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}

        <Suspense
          fallback={
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          }
        >
          <Fade in>
            <Box minHeight="320px">{showSuccess ? <OrderSuccess /> : renderStep()}</Box>
          </Fade>
        </Suspense>

        {/* validation message */}
        {validationError && (
          <Box sx={{ color: "error.main", mt: 2 }}>{validationError}</Box>
        )}

        {/* Navigation buttons */}
        {!showSuccess && (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            mt={3}
            justifyContent="space-between"
          >
            <Box>
              <Button
                variant="outlined"
                onClick={prevStep}
                disabled={activeStep === 0}
                size="medium"
              >
                Back
              </Button>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              {activeStep < steps.length - 1 ? (
                <Button variant="contained" onClick={nextStep} size="medium">
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handlePayNow}
                  disabled={loading}
                  size="medium"
                >
                  {loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Pay Now"
                  )}
                </Button>
              )}
            </Box>
          </Stack>
        )}
      </Paper>
    </Box>
  );
}
