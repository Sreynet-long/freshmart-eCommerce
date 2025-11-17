"use client";

import React, { useState, useEffect, useRef } from "react";
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

function EditProfile() {
  const { user, setUser } = useAuth();
  const firstFieldRef = useRef(null);

  const [avatarPreview, setAvatarPreview] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    phoneNumber: "",
  });

  // Load user data into form
  useEffect(() => {
    if (user) {
      setFormValues({
        username: user.username || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
      setAvatarPreview(user.avatar || "");
      setTimeout(() => firstFieldRef.current?.focus(), 200);
    }
  }, [user]);

  // Avatar preview
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  // Mutation
  const [updateProfile, { loading }] = useMutation(UPDATE_USER, {
    onCompleted: (data) => {
      const res = data?.updateUser;

      if (!res) {
        setFeedback({ type: "error", message: "No response from server" });
        return;
      }

      if (res.isSuccess) {
        // Update auth user state
        setUser((prev) => ({
          ...prev,
          ...formValues, // Use updated form values
        }));

        setFeedback({
          type: "success",
          message: res.messageEn || "Profile updated successfully!",
        });
      } else {
        setFeedback({
          type: "error",
          message: res.messageEn || res.messageKh || "Update failed",
        });
      }
    },
    onError: (err) => {
      console.error("GraphQL Error:", err);
      setFeedback({
        type: "error",
        message: err.message || "Something went wrong",
      });
    },
  });

  const handleSubmit = (values) => {
    const userId = user?._id || user?.id;

    if (!userId) {
      setFeedback({ type: "error", message: "User ID missing!" });
      return;
    }

    setFormValues(values);

    updateProfile({
      variables: {
        id: userId, // MUST use "id" because your mutation requires $id
        input: {
          username: values.username,
          email: values.email,
          phoneNumber: values.phoneNumber,
        },
      },
    });
  };

  if (!user)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box p={3} display="flex" justifyContent="center">
      <Paper sx={{ p: 4, maxWidth: 500, width: "100%", borderRadius: 3 }}>
        <Stack justifyContent="flex-end" mb={2}>
          <Link href="/profile" style={{ textDecoration: "none" }}>
            <Typography variant="body1" color="success">
              ← Back
            </Typography>
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
          initialValues={formValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
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
                inputRef={firstFieldRef}
                disabled={loading}
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
                disabled={loading}
              />

              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={values.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
                disabled={loading}
              />

              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{ mt: 3 }}
                disabled={loading || !dirty}
              >
                {loading ? <CircularProgress size={24} /> : "Save Changes"}
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>

      <Snackbar
        open={!!feedback.message}
        autoHideDuration={5000}
        onClose={() => setFeedback({ ...feedback, message: "" })}
      >
        <Alert
          severity={feedback.type}
          onClose={() => setFeedback({ ...feedback, message: "" })}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default EditProfile;
