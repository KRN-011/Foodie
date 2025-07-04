import express from "express";
import { authenticateUser } from "../middlewares/authentication.js";
import { addToCart, getCart, deleteCartItem, clearCart, updateCartItemQuantity } from "../controllers/cart.controller.js";

const router = express.Router();


router.post("/add-to-cart", authenticateUser, addToCart);
router.get("/get", authenticateUser, getCart);
router.delete("/delete-cart-item/:cartItemId", authenticateUser, deleteCartItem);
router.delete("/clear-cart", authenticateUser, clearCart);
router.put("/update-cart-item-quantity/:cartItemId", authenticateUser, updateCartItemQuantity);


export default router;