import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs: [],
        allAdminJobs: [],
        singleJob: null,
        searchJobByText: "",
        allAppliedJobs: [],
        searchedQuery: "",
        savedJobs: [],
    },
    reducers: {
        // actions
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
        },
        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs: (state, action) => {
            state.allAdminJobs = action.payload;
        },
        setSearchJobByText: (state, action) => {
            state.searchJobByText = action.payload;
        },
        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = action.payload;
        },
        setSearchedQuery: (state, action) => {
            state.searchedQuery = action.payload;
        },
        toggleSavedJob: (state, action) => {
            const job = action.payload;
            const exists = state.savedJobs.some(j => j._id === job._id);
            if (exists) {
                state.savedJobs = state.savedJobs.filter(j => j._id !== job._id);
            } else {
                state.savedJobs.push(job);
            }
        },
        setSavedJobs: (state, action) => {
            state.savedJobs = action.payload;
        }
    }
});
export const {
    setAllJobs,
    setSingleJob,
    setAllAdminJobs,
    setSearchJobByText,
    setAllAppliedJobs,
    setSearchedQuery,
    toggleSavedJob,
    setSavedJobs
} = jobSlice.actions;
export default jobSlice.reducer;