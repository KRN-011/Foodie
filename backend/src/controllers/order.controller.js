import prisma from '../lib/prismaClient.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { SOCKET_EVENTS } from '../constants/socketEvents.js';
import {
    emitOrdersInLast24Hours,
    emitTotalRevenueInLast24Hours,
    emitCancelledFailedOrdersInLast24Hours,
} from '../socket/emit.js';

let razorpay;
function getRazorpayInstance() {
    if (!razorpay) {
        razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }
    return razorpay;
}

// create razorpay order
export const createRazorpayOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100, // amount in paise
            currency: 'INR',
            receipt: `foodie_order_${Date.now()}`,
        };

        const razorpay = getRazorpayInstance();

        const order = await razorpay.orders.create(options);
        res.json({
            success: true,
            order,
            message: 'Razorpay order created successfully',
        });
    } catch (error) {
        console.error('Error creating razorpay order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create razorpay order',
            error: error.message,
        });
    }
};

// verify razorpay order
export const verifyRazorpayOrder = async (req, res) => {
    try {
        const {
            data: {
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature,
            },
        } = req.body;

        const hmac = crypto.createHmac(
            'sha256',
            process.env.RAZORPAY_KEY_SECRET
        );
        hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
        const generated_signature = hmac.digest('hex');

        if (generated_signature === razorpay_signature) {
            res.status(200).json({
                success: true,
                message: 'Razorpay order verified successfully',
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid signature',
            });
        }
    } catch (error) {
        console.error('Error verifying razorpay order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify razorpay order',
            error: error.message,
        });
    }
};

// create order
export const createOrder = async (req, res) => {
    try {
        const { id } = req.user;
        const {
            items,
            paymentMethod,
            addressId,
            amount,
            status,
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            orderId = `ORD_${Date.now()}`,
        } = req.body;

        const payment = await prisma.payment.create({
            data: {
                amount,
                method: paymentMethod,
                razorpayOrderId:
                    paymentMethod === 'PREPAID' ? razorpayOrderId : null,
                razorpayPaymentId:
                    paymentMethod === 'PREPAID' ? razorpayPaymentId : null,
                razorpaySignature:
                    paymentMethod === 'PREPAID' ? razorpaySignature : null,
            },
        });

        const order = await prisma.order.create({
            data: {
                orderId,
                receiverName: req.user.email,
                paymentId: payment.id,
                userId: id,
                addressId,
                status,
                items: {
                    create: items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: {
                items: true,
                payment: true,
            },
        });

        // Find all carts for the user
        const userCarts = await prisma.cart.findMany({
            where: { userId: id },
            select: { id: true },
        });
        const cartIds = userCarts.map((cart) => cart.id);

        if (cartIds.length > 0) {
            // Delete all cart items for these carts
            await prisma.cartItem.deleteMany({
                where: { cartId: { in: cartIds } },
            });
            // Delete the carts
            await prisma.cart.deleteMany({
                where: { id: { in: cartIds } },
            });
        }

        // emit active users to all connected clients
        const io = req.app.get('io');
        await emitOrdersInLast24Hours(io);
        await emitTotalRevenueInLast24Hours(io);
        await emitCancelledFailedOrdersInLast24Hours(io);

        res.status(201).json({
            success: true,
            order,
            message: 'Order created successfully',
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order',
            error: error.message,
        });
    }
};

// get orders by user id
export const getOrdersByUserId = async (req, res) => {
    try {
        const { id } = req.user;

        const orders = await prisma.order.findMany({
            where: {
                userId: id,
            },
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
            orders,
            message: 'Orders fetched successfully',
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message,
        });
    }
};

// get order by order id
export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { id: userId } = req.user;

        const order = await prisma.order.findUnique({
            where: { orderId },
            include: {
                items: { include: { product: true } },
                payment: true,
                address: true,
            },
        });

        if (!order || order.userId !== userId) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        res.status(200).json({
            success: true,
            order,
            message: 'Order fetched successfully',
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order',
            error: error.message,
        });
    }
};

// update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const io = req.app.get('io');

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required',
            });
        }

        const order = await prisma.order.update({
            where: {
                orderId,
            },
            data: {
                status,
            },
        });

        io.emit(SOCKET_EVENTS.ORDER_STATUS_UPDATES, {
            orderId,
            newStatus: status,
        });

        await emitCancelledFailedOrdersInLast24Hours(io);

        res.status(200).json({
            success: true,
            order,
            message: 'Order status updated successfully',
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order status',
            error: error.message,
        });
    }
};
