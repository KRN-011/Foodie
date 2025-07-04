import express from "express";
import { createAddress, getAllAddresses, updateAddress, deleteAddress } from "../controllers/address.controller.js";
import { authenticateUser } from "../middlewares/authentication.js";

const router = express.Router();


router.post("/create", authenticateUser, createAddress);
router.get("/all", authenticateUser, getAllAddresses);
router.put("/update/:id", authenticateUser, updateAddress);
router.delete("/delete/:id", authenticateUser, deleteAddress);

export default router;