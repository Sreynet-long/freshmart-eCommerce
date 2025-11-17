"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useMutation } from "@apollo/client/react";
import { UPDATE_USER } from "../../schema/User";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Link from "next/link";

export default function EditProfile() {
  const { user, setUser } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState("");
  const [alert, setAlert] = useState({ open: false, message: "", type: "" });

  const [updateProfile, { loading }] = useMutation(UPDATE_USER, {
    onCompleted: (data) => {
      if (data?.updateUser?.isSuccess) {
        setUser({ ...user, ...formikValues });
        setAlert({
          open: true,
          type: "success",
          message: data.updateUser.messageEn || "Profile updated successfully!",
        });
      } else {
        setAlert({
          open: true,
          type: "error",
          message: data.updateUser.messageEn || "Failed to update profile.",
        });
      }
    },
    onError: (err) => {
      console.error(err);
      setAlert({ open: true, type: "error", message: err.message });
    },
  });

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    phoneNumber: Yup.string(),
  });

  const [formikValues, setFormikValues] = useState({
    username: "",
    email: "",
    phoneNumber: "",
  });

  // Populate form when user loads
  useEffect(() => {
    if (user) {
      setFormikValues({
        username: user.username || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
      setAvatarPreview(user.avatar || "");
    }
  }, [user]);

  // Handle avatar upload preview
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    // TODO: upload avatar if needed
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3} display="flex" justifyContent="center">
      <Paper sx={{ p: 4, maxWidth: 500, width: "100%", borderRadius: 3 }}>
        <Stack justifyContent="flex-end" mb={2}>
          <Link href="/profile" passHref style={{ textDecoration: "none" }}>
            <Box display="flex" alignItems="center" gap={0.5} sx={{ cursor: "pointer" }}>
              <Typography variant="body1" color="success">
                ← Back
              </Typography>
            </Box>
          </Link>
        </Stack>

        <Typography variant="h5" fontWeight="bold" mb={3}>
          Edit Profile
        </Typography>

        <Stack alignItems="center" mb={2}>
          <Avatar src={avatarPreview} sx={{ width: 90, height: 90, mb: 1 }} />
          <Button component="label" variant="outlined">
            Change Avatar
            <input type="file" hidden accept="image/*" onChange={handleAvatarUpload} />
          </Button>
        </Stack>

        <Formik
          enableReinitialize
          initialValues={formikValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            if (!user._id) {
              setAlert({ open: true, type: "error", message: "User ID is missing!" });
              return;
            }
            setFormikValues(values);
            updateProfile({
              variables: {
                id: user._id, // GraphQL variable
                input: values, // must match mutation's input object
              },
            });
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, dirty }) => (
            <Form>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
                error={touched.username && Boolean(errors.username)}
                helperText={touched.username && errors.username}
              />

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />

              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={values.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
                error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                helperText={touched.phoneNumber && errors.phoneNumber}
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                type="submit"
                disabled={loading || !dirty}
              >
                {loading ? <CircularProgress size={24} /> : "Save Changes"}
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>

      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert
          severity={alert.type}
          onClose={() => setAlert({ ...alert, open: false })}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
