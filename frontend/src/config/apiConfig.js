const API_URL =
  import.meta.env.MODE === "production"
    ? "https://urban-farming.onrender.com"
    : "http://localhost:3000";

export default API_URL;
