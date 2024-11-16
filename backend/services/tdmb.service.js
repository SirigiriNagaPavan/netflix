import axios from "axios";
import { ENV_VARS } from "../config/envVars.js";

export const fetchFromTMDB = async (url) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${ENV_VARS.TMDB_API_KEY}`, // Use the token from ENV_VARS
    },
  };

  try {
    const response = await axios.get(url, options);
    return response.data;
  } catch (error) {
    console.error("Error fetching from TMDB:", error.message);
    throw new Error("Failed to fetch data from TMDB");
  }
};
