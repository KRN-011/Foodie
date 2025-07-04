import express from "express";
import { authenticateUser } from "../middlewares/authentication.js";
import { getAddressDetails } from "../controllers/miscellaneous.controller.js";

const router = express.Router();


// ============================================================
// Get Address Details by lat and long
// ============================================================

router.get("/get-address-details", authenticateUser, getAddressDetails);


export default router;