"use client";

import React, { useState, useEffect } from "react";
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
import Link from "next/link";

function EditProfile() {
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    phoneNumber: "",
  });

  const [avatarPreview, setAvatarPreview] = useState("");
  const [alert, setAlert] = useState({ open: false, message: "", type: "" });

  const [updateProfile, { loading }] = useMutation(UPDATE_USER);

  // Populate form when user loads
  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
      setAvatarPreview(user.avatar || "");
    }
  }, [user]);

  // Handle input changes
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Avatar upload preview
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    // Optionally convert to base64 if needed
  };

  // Submit updated profile
  const handleSubmit = async () => {
    if (!user?._id) {
      setAlert({ open: true, message: "User ID is missing!", type: "error" });
      return;
    }

    try {
      const { data } = await updateProfile({
        variables: {
          id: user._id,
          username: form.username,
          email: form.email,
          phoneNumber: form.phoneNumber,
        },
      });

      if (data?.updateUser?.isSuccess) {
        setUser({ ...user, ...form });
        setAlert({
          open: true,
          message: data.updateUser.messageEn || "Profile updated successfully!",
          type: "success",
        });
      } else {
        setAlert({
          open: true,
          message: data.updateUser.messageEn || "Failed to update profile.",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setAlert({ open: true, message: err.message, type: "error" });
    }
  };

  // Show loading if user is not yet loaded
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
            <Box
              display="flex"
              alignItems="center"
              gap={0.5}
              sx={{ cursor: "pointer" }}
            >
              <Typography variant="body1" color="success">
               ← Back
              </Typography>
              {/* <img
                src="/right-arrow.png"
                alt="right-arrow"
                style={{ width: "10px", height: "10px" }}
              /> */}
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
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleAvatarUpload}
            />
          </Button>
        </Stack>

        <TextField
          fullWidth
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Phone Number"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          margin="normal"
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Save Changes"}
        </Button>
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

export default EditProfile;
