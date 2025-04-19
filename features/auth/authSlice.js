import {createSlice} from '@reduxjs/toolkit';
import { loginUser, signupUser, logoutUser } from './authActions';

const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    loading: false,
    error: null,
};

const authSlice = createSlice(
    {
        name: "auth",
        initialState,
        reducers:{}, //no need of reducers, as actions are async
        extraReducers: (builder) => {
            builder
            //login cases
            .addCase(loginUser.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action)=>{
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload;
            })


            // Signup Cases
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                localStorage.setItem("user", JSON.stringify(action.payload)); 
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Logout Case
            .addCase(logoutUser.fulfilled, (state) => {
                 state.user = null;
            });
        }
    }
)

export default authSlice.reducer;
