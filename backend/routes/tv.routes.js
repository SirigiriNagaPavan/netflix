import express from "express";
import {
  getTrendingTV,
  getTvShowDetails,
  getTvShowTrailer,
} from "../controllers/tv.controller.js";

const router = express.Router();

router.get("/trending", getTrendingTV);
router.get("/:id/trailers", getTvShowTrailer);
router.get("/:id/details", getTvShowDetails);
// router.get("/:id/similar");
// router.get("/category");

export default router;
