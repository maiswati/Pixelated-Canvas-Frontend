//Auth API handles API calls related to login, signup  and logout
import axios from 'axios';
const API = import.meta.env.VITE_API;
export const API_BASE_URL = API;

export const loginAPI = async (formData) => {
        const response = await axios.post(`${API_BASE_URL}/users/login`, formData);
        return response.data; 
};


//Function to send signup request
export const signupAPI = async(formData) => {
    const response = await axios.post(`${API_BASE_URL}/users/register`, formData);
    return response.data; //returns user info.
}
