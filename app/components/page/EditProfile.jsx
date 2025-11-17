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

function EditProfile() {
  const { user, setUser } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState("");
  const firstFieldRef = useRef(null);

  const [updateProfile, { loading }] = useMutation(UPDATE_USER, {
    onCompleted: ({ updateUser }) => {
      if (updateUser?.isSuccess) {
        setUser({ ...user, ...formValues });
        setFeedback({ type: "success", message: updateUser.messageEn || "Profile updated successfully!" });
      } else {
        setFeedback({ type: "error", message: updateUser?.messageEn || "Failed to update profile." });
      }
    },
    onError: (err) => {
      setFeedback({ type: "error", message: err.message || "Something went wrong" });
    },
  });

  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    phoneNumber: "",
  });

  // populate form
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

  // Avatar upload preview
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
  };

  // Form validation schema
  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: Yup.string(),
  });

  const handleSubmit = (values) => {
    const userId = user?._id || user?.id;

    if (!userId) {
      setFeedback({ type: "error", message: "User ID is missing!" });
      return;
    }

    setFeedback({ type: "", message: "" });
    setFormValues(values);

    updateProfile({ variables: { id: userId, input: values } });
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
        <Typography variant="h5" fontWeight="bold" mb={3}>Edit Profile</Typography>

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
                error={touched.username && Boolean(errors.username)}
                helperText={touched.username && errors.username}
                margin="normal"
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
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                margin="normal"
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={values.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                helperText={touched.phoneNumber && errors.phoneNumber}
                margin="normal"
                disabled={loading}
              />

              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{ mt: 3 }}
                disabled={loading || !dirty || !values.username.trim()}
              >
                {loading ? <CircularProgress size={24} /> : "Save Changes"}
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>

      <Snackbar
        open={!!feedback.message}
        autoHideDuration={3000}
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
