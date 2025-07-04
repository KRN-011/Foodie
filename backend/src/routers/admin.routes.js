import express from "express";
import { loginAdmin, logoutAdmin, getAllAdmins, revokeAdmin, addAdmin, deleteUserById, getAllUsers, getAuditLogs, getAllRestaurants, getProductsByRestaurantId, getOrdersByRestaurantId, getAllAuditLogs, updateUserById, getAllOrders } from "../controllers/admin.controller.js";
import { authenticateUser, checkAdmin } from "../middlewares/authentication.js";

const router = express.Router();


router.post("/login", loginAdmin);
router.post("/logout", authenticateUser, checkAdmin, logoutAdmin);
router.get("/all", authenticateUser, checkAdmin, getAllAdmins);
router.delete("/revoke/:id", authenticateUser, checkAdmin, revokeAdmin);
router.post("/add", authenticateUser, checkAdmin, addAdmin);
router.delete("/delete-user/:id", authenticateUser, checkAdmin, deleteUserById);
router.get("/users", authenticateUser, checkAdmin, getAllUsers);
router.put("/update-user/:id", authenticateUser, checkAdmin, updateUserById);
router.get("/audit-logs", authenticateUser, checkAdmin, getAuditLogs);
router.get("/restaurants", authenticateUser, checkAdmin, getAllRestaurants);
router.get("/products/restaurant/:id", authenticateUser, checkAdmin, getProductsByRestaurantId);
router.get("/orders", authenticateUser, checkAdmin, getAllOrders);
router.get("/orders/restaurant/:id", authenticateUser, checkAdmin, getOrdersByRestaurantId);
router.get("/audit-logs", authenticateUser, checkAdmin, getAllAuditLogs);


export default router;