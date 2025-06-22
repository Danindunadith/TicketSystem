import express from "express";
import { analyzeSentiment } from "../controllers/analysisController.js";

const analysisRouter = express.Router();

analysisRouter.post("/sentiment", analyzeSentiment);

export default analysisRouter;