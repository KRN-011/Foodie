import prisma from '../lib/prismaClient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// register restaurant
export const registerRestaurant = async (req, res) => {
    try {
        const { username, name, email, password, description, logo } = req.body;

        const existingRestaurant = await prisma.user.findUnique({
            where: { email },
        });

        if (existingRestaurant) {
            return res.status(400).json({
                success: false,
                message: 'Restaurant already exists',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newRestaurant = await prisma.user.create({
            data: {
                username,
                email,
                hashedPassword,
                role: 'RESTAURANT',
                restaurantProfile: {
                    create: {
                        name,
                        description,
                        logo,
                    },
                },
            },
        });

        return res.status(200).json({
            success: true,
            message: 'Restaurant registered successfully',
            restaurant: newRestaurant,
        });
    } catch (error) {
        console.error('Error registering restaurant:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// login restaurant
export const loginRestaurant = async (req, res) => {
    try {
        const { email, password } = req.body;
        const restaurant = await prisma.user.findUnique({
            where: {
                email,
                role: 'RESTAURANT',
            },
            include: {
                restaurantProfile: true,
            },
        });

        if (!restaurant) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            restaurant.hashedPassword
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        const token = jwt.sign(
            {
                id: restaurant.id,
                email: restaurant.email,
                role: 'RESTAURANT',
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                ...restaurant,
                restaurantProfile: restaurant.restaurantProfile,
            },
        });
    } catch (error) {
        console.error('Error logging in restaurant:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// logout restaurant
export const logoutRestaurant = async (req, res) => {
    try {
        const { id } = req.user;

        // delete token from token table
        await prisma.token.deleteMany({
            where: {
                userId: id,
            },
        });

        return res.status(200).json({
            success: true,
            message: 'Logout successful',
        });
    } catch (error) {
        console.error('Error logging out restaurant:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// get restaurant profile
export const getRestaurantProfile = async (req, res) => {
    try {
        const { id } = req.user;

        const restaurant = await prisma.user.findUnique({
            where: {
                id,
            },
            include: {
                restaurantProfile: true,
            },
        });

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Restaurant profile fetched successfully',
            restaurant,
        });
    } catch (error) {
        console.error('Error getting restaurant profile:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// delete restaurant
export const deleteRestaurant = async (req, res) => {
    try {
        const { id } = req.user;

        const restaurant = await prisma.user.findUnique({
            where: {
                id,
                role: 'RESTAURANT',
                deleted: false,
            },
        });

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found',
            });
        }

        await prisma.user.update({
            where: {
                id,
            },
            data: {
                deleted: true,
            },
        });

        return res.status(200).json({
            success: true,
            message: 'Restaurant deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting restaurant:', error);
    }
}