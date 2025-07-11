
import express from "express";
import { authenticateUser } from "../middlewares/authentication.js";
import { getTopStates } from "../controllers/combined.controller.js";

const router = express.Router();


router.get("/top-states", authenticateUser, getTopStates)


export default router;