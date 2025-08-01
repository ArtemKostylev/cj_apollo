import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000",
});

export const httpClient = axiosInstance;