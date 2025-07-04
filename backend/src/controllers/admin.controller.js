import prisma from '../lib/prismaClient.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// login admin
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check if admin exists
        const admin = await prisma.user.findUnique({
            where: { email, role: 'ADMIN' },
        });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Admin not found',
            });
        }

        // check if password is correct
        const isPasswordCorrect = await bcrypt.compare(
            password,
            admin.hashedPassword
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password',
            });
        }

        // generate token
        const token = jwt.sign(
            {
                id: admin.id,
                email: admin.email,
                role: 'ADMIN',
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d',
            }
        );

        // save token to database
        await prisma.token.create({
            data: {
                userId: admin.id,
                token,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        res.status(200).json({
            success: true,
            message: 'Admin logged in successfully',
            token,
            user: admin,
        });
    } catch (error) {
        console.error('Error logging in admin:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// logout admin
export const logoutAdmin = async (req, res) => {
    try {
        const { id } = req.user;

        // delete token
        await prisma.token.deleteMany({
            where: { userId: id },
        });

        res.status(200).json({
            success: true,
            message: 'Admin logged out successfully',
        });
    } catch (error) {
        console.error('Error logging out admin:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// get all admins
export const getAllAdmins = async (req, res) => {
    try {
        const admins = await prisma.user.findMany({
            where: { role: 'ADMIN' },
        });

        res.status(200).json({
            success: true,
            message: 'Admins fetched successfully',
            data: admins,
        });
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// revoke admin
export const revokeAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        // check if admin exists
        const admin = await prisma.user.findUnique({
            where: { id: Number(id), role: 'ADMIN' },
        });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found',
            });
        }

        // delete admin
        await prisma.user.delete({
            where: { id: Number(id), role: 'ADMIN' },
        });

        res.status(200).json({
            success: true,
            message: 'Admin deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting admin:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// add admin
export const addAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check if admin already exists
        const existingAdmin = await prisma.user.findUnique({
            where: { email, role: 'ADMIN' },
        });

        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: 'Admin already exists',
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create admin
        const admin = await prisma.user.upsert({
            where: {
                id: existingAdmin?.id,
                email,
            },
            update: {
                role: 'ADMIN',
            },
            create: {
                email,
                hashedPassword,
                role: 'ADMIN',
            },
        });

        res.status(201).json({
            success: true,
            message: 'Admin added successfully',
            data: admin,
        });
    } catch (error) {
        console.error('Error adding admin:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// delete user by id
export const deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;

        // check if user exists
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        await prisma.user.delete({
            where: { id: Number(id) },
        });

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();

        res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            data: users,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// update user by id
export const updateUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;

        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: { name, email, role },
        });

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: user,
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// get audit logs
export const getAuditLogs = async (req, res) => {
    try {
        const auditLogs = await prisma.auditLog.findMany();

        res.status(200).json({
            success: true,
            message: 'Audit logs fetched successfully',
            data: auditLogs,
        });
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// get all restaurants
export const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await prisma.user.findMany({
            where: { role: 'RESTAURANT' },
        });

        res.status(200).json({
            success: true,
            message: 'Restaurants fetched successfully',
            data: restaurants,
        });
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// get all orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                payment: true,
                address: true,
            },
        });

        res.status(200).json({
            success: true,
            message: 'Orders fetched successfully',
            data: orders,
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
};

// get products by restaurant id
export const getProductsByRestaurantId = async (req, res) => {
    try {
        const { id } = req.params;

        // check if restaurant exists
        const restaurant = await prisma.user.findUnique({
            where: { id: Number(id), role: 'RESTAURANT' },
        });

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found',
            });
        }

        const products = await prisma.product.findMany({
            where: { restaurantId: id },
        });

        res.status(200).json({
            success: true,
            message: 'Products fetched successfully',
            data: products,
        });
    } catch (error) {
        console.error('Error fetching products by restaurant id:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// get orders by restaurant id
export const getOrdersByRestaurantId = async (req, res) => {
    try {
        const { id } = req.params;

        // check if restaurant exists
        const restaurant = await prisma.user.findUnique({
            where: { id: Number(id), role: 'RESTAURANT' },
        });

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found',
            });
        }

        const orders = await prisma.order.findMany({
            where: { restaurantId: id },
        });

        res.status(200).json({
            success: true,
            message: 'Orders fetched successfully',
            data: orders,
        });
    } catch (error) {
        console.error('Error fetching orders by restaurant id:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// get all audit logs
export const getAllAuditLogs = async (req, res) => {
    try {
        const auditLogs = await prisma.auditLog.findMany();

        res.status(200).json({
            success: true,
            message: 'Audit logs fetched successfully',
            data: auditLogs,
        });
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
