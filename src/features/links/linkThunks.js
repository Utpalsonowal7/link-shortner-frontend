import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";

export const createLink = createAsyncThunk(
     "links/create",
     async (data, { rejectWithValue }) => {
          try {
               const res = await api.post("/links", data);
               return res.data.data;
          } catch (err) {
               return rejectWithValue(
                    err.response?.data?.message || "Failed to create link",
               );
          }
     },
);

export const fetchUserLinks = createAsyncThunk(
     "links/fetchAll",
     async (params = {}, { rejectWithValue }) => {
          try {
               const res = await api.get("/links", { params });
               return res.data.data;
          } catch (err) {
               return rejectWithValue(
                    err.response?.data?.message || "Failed to fetch links",
               );
          }
     },
);

export const fetchLinkById = createAsyncThunk(
     "links/fetchOne",
     async (id, { rejectWithValue }) => {
          try {
               const res = await api.get(`/links/${id}`);
               return res.data.data;
          } catch (err) {
               return rejectWithValue(
                    err.response?.data?.message || "Failed to fetch link",
               );
          }
     },
);

export const deleteLink = createAsyncThunk(
     "links/delete",
     async (id, { rejectWithValue }) => {
          try {
               await api.delete(`/links/${id}`);
               return id;
          } catch (err) {
               return rejectWithValue(
                    err.response?.data?.message || "Failed to delete link",
               );
          }
     },
);

export const fetchLinkAnalytics = createAsyncThunk(
     "links/analytics",
     async ({ id, range = "7d" }, { rejectWithValue }) => {
          try {
               const res = await api.get(`/links/${id}/analytics`, {
                    params: { range },
               });
               return res.data.data;
          } catch (err) {
               return rejectWithValue(
                    err.response?.data?.message || "Failed to fetch analytics",
               );
          }
     },
);

export const fetchUserStats = createAsyncThunk(
     "links/stats",
     async (_, { rejectWithValue }) => {
          try {
               const res = await api.get("/links/stats");
               return res.data.data;
          } catch (err) {
               return rejectWithValue(
                    err.response?.data?.message || "Failed to fetch stats",
               );
          }
     },
);

export const fetchTopStats = createAsyncThunk(
     "links/topStats",
     async (_, { rejectWithValue }) => {
          try {
               const res = await api.get("/stats/top-stats");
               return res.data.data;
          } catch (err) {
               return rejectWithValue(
                    err.response?.data?.message || "Failed to fetch stats",
               );
          }
     },
);
