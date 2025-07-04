
// package imports
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";

// router imports
import authenticationRoutes from "./routers/authentication.routes.js";
import productRoutes from "./routers/product.routes.js";
import cartRoutes from "./routers/cart.routes.js";
import adminRoutes from "./routers/admin.routes.js";
import restaurantRoutes from "./routers/restaurant.route.js";
import addressRoutes from "./routers/address.route.js";
import orderRoutes from "./routers/order.routes.js";
import miscellaneousRoutes from "./routers/miscellaneous.route.js";
import devRoutes from "./routers/dev.routes.js";




// environment variables
dotenv.config();

// database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

// express app
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({ message: "API is running!", timestamp: result.rows[0].now });
    } catch (error) {
        res.status(500).json({ message: "Error connecting to database", error: error.message });
    }
})

app.use("/api/auth", authenticationRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/miscellaneous", miscellaneousRoutes);
app.use("/api/dev", devRoutes);

export default app;