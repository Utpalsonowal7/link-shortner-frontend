import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";

export const registerUser = createAsyncThunk(
    "auth/register",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await api.post("/auth/register", formData);
            return res.data.data.user;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Registration failed",
            );
        }
    },
);

export const loginUser = createAsyncThunk(
    "auth/login",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await api.post("/auth/login", formData);
            return res.data.data.user;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Login failed",
            );
        }
    },
);

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await api.post("/auth/logout");
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Logout failed",
            );
        }
    },
);

export const getCurrentUser = createAsyncThunk(
    "auth/me",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/auth/me");
            return res.data.data.user;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch user",
            );
        }
    },
);

export const verifyOtp = createAsyncThunk(
    "auth/verifyOtp",
    async (data, { rejectWithValue }) => {
        try {
            const res = await api.post("/auth/verify-otp", data);
            return res.data;
        } catch (err) {
            console.log(err.response);
            return rejectWithValue(
                err.response?.data?.message || "OTP verification failed",
            );
        }
    },
);

export const resendOtp = createAsyncThunk(
    "auth/resendOtp",
    async (data, { rejectWithValue }) => {
        try {
            const res = await api.post("/auth/resend-otp", data);
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to resend OTP",
            );
        }
    },
);

export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async (data, { rejectWithValue }) => {
        try {
            const res = await api.post("/auth/forgot-password", data);
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to send reset code",
            );
        }
    },
);

export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async (data, { rejectWithValue }) => {
        try {
            const res = await api.post("/auth/reset-password", data);
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to reset password",
            );
        }
    },
);
