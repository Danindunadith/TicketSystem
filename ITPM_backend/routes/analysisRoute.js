import express from "express";
import { analyzeSentiment, getSentimentStats } from "../controllers/analysisController.js";

const analysisRouter = express.Router();

analysisRouter.post("/sentiment", analyzeSentiment);
analysisRouter.get("/sentiment-stats", getSentimentStats);

export default analysisRouter;