import jwt from "jsonwebtoken";
import prisma from "../lib/prismaClient.js";

// check if user is authenticated
export const authenticateUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token not found"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (error) {
        console.error("Error authenticating user:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

// check if user is ADMIN
export const checkAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token not found"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id,
                role: "ADMIN"
            }
        })

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }

        if (user.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "User is not an admin"
            })
        }

        next();
    } catch (error) {
        console.error("Error checking admin:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

// check if user is RESTAURANT
export const checkRestaurant = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token not found"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id
            }
        })

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }

        if (user.role !== "RESTAURANT") {
            return res.status(403).json({
                success: false,
                message: "User is not a restaurant"
            })
        }

        next();
    } catch (error) {
        console.error("Error checking restaurant:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}