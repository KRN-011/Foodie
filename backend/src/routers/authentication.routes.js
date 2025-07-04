import express from "express";
import { registerUser, loginUser, logoutUser, getUser } from "../controllers/authentication.controller.js";
import { authenticateUser } from "../middlewares/authentication.js";

const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authenticateUser, logoutUser);
router.get("/me", authenticateUser, getUser);


export default router;