import express from "express";
import { createRazorpayOrder, verifyRazorpayOrder, createOrder, getOrdersByUserId, getOrderById, updateOrderStatus } from "../controllers/order.controller.js";
import { authenticateUser } from "../middlewares/authentication.js";

const router = express.Router();


router.post("/create-razorpay-order", authenticateUser, createRazorpayOrder);
router.post("/verify-razorpay-order", authenticateUser, verifyRazorpayOrder);
router.post("/create-order", authenticateUser, createOrder);
router.get("/get-orders", authenticateUser, getOrdersByUserId);
router.get("/get-order/:orderId", authenticateUser, getOrderById);
router.put("/update-order-status/:orderId", authenticateUser, updateOrderStatus);


export default router;