import axios from "axios";

const AUTH_SERVICE_URL = "http://localhost:4000";

export const authMiddleware = async (req, res, next) => {

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization token is required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const response = await axios.get(`${AUTH_SERVICE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    req.user = response.data;
    next(); // Token is valid, proceed to the proxy.
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
