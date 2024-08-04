import express from "express";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.Routes.js";
import { connectDB } from "./config/db.js";
import { ENV_VARS } from "./config/envVars.js";

const app = express();

const PORT = ENV_VARS.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);

app.listen(5000, () => {
  console.log("Server started at port http://localhost:" + PORT);
  connectDB();
});
