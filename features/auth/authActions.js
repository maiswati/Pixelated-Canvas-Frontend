//authActions: contains redux thunk createAsyncThunk for making API calls.
import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI, signupAPI } from "./authAPI";

//Login Action
export const loginUser = createAsyncThunk("auth/login", async (formData, {rejectWithValue}) => {
    try{
        const response = await loginAPI(formData);
        console.log(response);

        if(!response.user || !response.token) {
          console.error("Missing user/token in API response.");
          return rejectWithValue("Invalid API Response");
        }
        // localStorage.setItem("user", JSON.stringify(response.user));
        // localStorage.setItem("token", response.token);

        return response.user;
    } catch(error) {
        console.error("Login API Error.");
        return rejectWithValue(error.response?.data?.message || "Login failed");
    }
});

export const signupUser = createAsyncThunk(
    "auth/signup",
    async (formData, { rejectWithValue }) => {
      try {
        const response = await signupAPI(formData); // API Call
  
        if (!response.user || !response.user) {
          throw new Error("Invalid API response");
        }
  
        return response.user;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Signup failed.");
      }
    }
  );
  

export const logoutUser = createAsyncThunk("auth/logout", async(_, {rejectWithValue})=>{
    try{
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        return null;
    }catch(error) {
        return rejectWithValue("Logout failed.");
    }
})