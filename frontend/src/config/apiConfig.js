const API_URL =
  import.meta.env.MODE === "production" ||
  import.meta.env.VITE_USE_PRODUCTION_API === "true"
    ? "https://urban-farming.onrender.com"
    : "http://localhost:3000";

console.log("API URL being used:", API_URL);

export default API_URL;
