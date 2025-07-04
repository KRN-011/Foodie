import express from "express";
import { createProduct, updateProduct, deleteProduct, getAllProducts, getProductById, getAllCategories, createCategory } from "../controllers/product.controller.js";
import { authenticateUser, checkAdmin } from "../middlewares/authentication.js";

const router = express.Router();

router.post("/create", authenticateUser, createProduct);
router.put("/update/:id", authenticateUser, checkAdmin, updateProduct);
router.delete("/delete/:id", authenticateUser, checkAdmin, deleteProduct);
router.get("/all", authenticateUser, getAllProducts);
router.get("/get/:id", authenticateUser, getProductById);
router.get("/categories", authenticateUser, getAllCategories);
router.post("/categories/create", authenticateUser, checkAdmin, createCategory);

export default router;