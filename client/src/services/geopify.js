import axios from "axios";
import { GEOAPIFY_KEY } from "../config/env.js";u

export const geopifyAPI = axios.create({
  baseURL: `https://api.geoapify.com/v1/geocode/autocomplete?apiKey=${GEOAPIFY_KEY}`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default geopifyAPI;
