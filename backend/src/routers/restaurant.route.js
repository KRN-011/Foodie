import express from "express";
import { authenticateUser, checkAdmin, checkRestaurant } from "../middlewares/authentication.js";
import { loginRestaurant, logoutRestaurant, getRestaurantProfile, registerRestaurant, deleteRestaurant } from "../controllers/restaurant.controller.js";

const router = express.Router();


router.post("/register", registerRestaurant);
router.post("/login", loginRestaurant);
router.post("/logout", authenticateUser, checkRestaurant, logoutRestaurant);
router.get("/profile", authenticateUser, checkRestaurant, getRestaurantProfile);
router.delete("/delete", authenticateUser, checkAdmin, deleteRestaurant);

export default router;