import express from "express";
import { authenticateUser, checkRestaurant } from "../middlewares/authentication.js";
import { loginRestaurant, logoutRestaurant, getRestaurantProfile, registerRestaurant } from "../controllers/restaurant.controller.js";

const router = express.Router();


router.post("/register", registerRestaurant);
router.post("/login", loginRestaurant);
router.post("/logout", authenticateUser, checkRestaurant, logoutRestaurant);
router.get("/profile", authenticateUser, checkRestaurant, getRestaurantProfile);


export default router;