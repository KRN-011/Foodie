import express from "express";
import { authenticateUser } from "../middlewares/authentication.js";
import { fillCartWithProducts } from "../controllers/dev.controller.js";

const router = express.Router();


router.post("/fill-cart/:quantity", authenticateUser, fillCartWithProducts);


export default router;