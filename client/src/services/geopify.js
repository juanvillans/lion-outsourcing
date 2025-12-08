import axios from "axios";
import { GEOAPIFY_KEY } from "../config/env.js";

export const geopifyAPI = axios.create({
  baseURL: `https://api.geoapify.com/v1/geocode/autocomplete?apiKey=${GEOAPIFY_KEY}`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default geopifyAPI;
