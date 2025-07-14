import jwt from 'jsonwebtoken';
import prisma from '../lib/prismaClient.js';
import bcrypt from 'bcrypt';
import {
    emitActiveUsers,
    emitCurrentActiveRestaurants,
} from '../socket/emit.js';

// register user
export const registerUser = async (req, res) => {
    try {
        const { username, email, password, role = 'USER' } = req.body;

        // check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists',
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const user = await prisma.user.create({
            data: {
                username,
                email,
                hashedPassword,
                role,
            },
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check if user exists
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found',
            });
        }

        // compare password
        const isPasswordValid = await bcrypt.compare(
            password,
            user.hashedPassword
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password',
            });
        }

        // generate token
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d',
            }
        );

        // save token to database
        await prisma.token.create({
            data: {
                userId: user.id,
                token,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        // update user currentlyActive to true
        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                currentlyActive: true,
            },
        });

        // emit active users to all connected clients
        const io = req.app.get('io');
        await emitActiveUsers(io);
        await emitCurrentActiveRestaurants(io);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user,
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// logout user
export const logoutUser = async (req, res) => {
    try {
        const { id } = req.user;

        // delete token from database
        await prisma.token.deleteMany({
            where: {
                userId: id,
            },
        });

        // update user currentlyActive to false
        await prisma.user.update({
            where: {
                id,
            },
            data: {
                currentlyActive: false,
            },
        });

        // emit active users to all connected clients
        const io = req.app.get('io');
        io.emit('activeUsers', await emitActiveUsers(req));

        res.status(200).json({
            success: true,
            message: 'Logout successful',
        });
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// get user
export const getUser = async (req, res) => {
    try {
        const { id } = req.user;

        // get user from database
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
            include: {
                address: {
                    include: {
                        orders: true,
                    },
                },
                orders: {
                    include: {
                        payment: true,
                        items: true,
                    },
                },
                carts: {
                    include: {
                        cartItems: true,
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'User fetched successfully',
            user,
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
