import express from "express";
import authRoutes from "./routes/auth.Routes.js";
const app = express();

app.use("/api/v1/auth", authRoutes);

app.listen(5000, () => {
  console.log("Server started at port 5000");
});
