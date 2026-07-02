import { createSlice } from "@reduxjs/toolkit";
import {
     createLink,
     fetchUserLinks,
     fetchLinkById,
     deleteLink,
     fetchLinkAnalytics,
     fetchUserStats,
     fetchTopStats,
} from "./linkThunks";

const initialState = {
     links: [],
     pagination: { total: 0, page: 1, limit: 20, totalPages: 1 },
     currentLink: null,
     analytics: null,
     stats: null,
     topStats: { top5Links: [], recent5Clikcs: [] },

     loading: false,
     createLoading: false,
     analyticsLoading: false,
     statsLoading: false,
     topStatsLoading: false,

     error: null,
};

const linkSlice = createSlice({
     name: "links",
     initialState,
     reducers: {
          clearLinkError: (state) => {
               state.error = null;
          },
          clearCurrentLink: (state) => {
               state.currentLink = null;
               state.analytics = null;
          },
     },
     extraReducers: (builder) => {
          builder
               // create
               .addCase(createLink.pending, (state) => {
                    state.createLoading = true;
                    state.error = null;
               })
               .addCase(createLink.fulfilled, (state, action) => {
                    state.createLoading = false;
                    state.links.unshift(action.payload);
               })
               .addCase(createLink.rejected, (state, action) => {
                    state.createLoading = false;
                    state.error = action.payload;
               })

               // fetch all
               .addCase(fetchUserLinks.pending, (state) => {
                    state.loading = true;
                    state.error = null;
               })
               .addCase(fetchUserLinks.fulfilled, (state, action) => {
                    state.loading = false;
                    state.links = action.payload.links;
                    state.pagination = action.payload.pagination;
               })
               .addCase(fetchUserLinks.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
               })

               // fetch one
               .addCase(fetchLinkById.pending, (state) => {
                    state.loading = true;
                    state.error = null;
               })
               .addCase(fetchLinkById.fulfilled, (state, action) => {
                    state.loading = false;
                    state.currentLink = action.payload;
               })
               .addCase(fetchLinkById.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
               })

               // delete
               .addCase(deleteLink.fulfilled, (state, action) => {
                    state.links = state.links.filter(
                         (l) => l.id !== action.payload,
                    );
               })
               .addCase(deleteLink.rejected, (state, action) => {
                    state.error = action.payload;
               })

               // analytics
               .addCase(fetchLinkAnalytics.pending, (state) => {
                    state.analyticsLoading = true;
                    state.error = null;
               })
               .addCase(fetchLinkAnalytics.fulfilled, (state, action) => {
                    state.analyticsLoading = false;
                    state.analytics = action.payload;
               })
               .addCase(fetchLinkAnalytics.rejected, (state, action) => {
                    state.analyticsLoading = false;
                    state.error = action.payload;
               })

               // stats
               .addCase(fetchUserStats.pending, (state) => {
                    state.statsLoading = true;
                    state.error = null;
               })
               .addCase(fetchUserStats.fulfilled, (state, action) => {
                    state.statsLoading = false;
                    state.stats = action.payload;
               })
               .addCase(fetchUserStats.rejected, (state, action) => {
                    state.statsLoading = false;
                    state.error = action.payload;
               })

               //top stats
               .addCase(fetchTopStats.pending, (state) => {
                    state.topStatsLoading = true;
                    state.error = null;
               })
               .addCase(fetchTopStats.fulfilled, (state, action) => {
                    state.topStatLoading = false;
                    state.topStats = action.payload;
               })
               .addCase(fetchTopStats.rejected, (state, action) => {
                    state.statsLoading = false;
                    state.error = action.payload;
               });
     },
});

export const { clearLinkError, clearCurrentLink } = linkSlice.actions;
export default linkSlice.reducer;
