import prisma from "../lib/prismaClient.js";
import { SOCKET_EVENTS } from "../constants/socketEvents.js";


// ===============================================================
// USERS
// ===============================================================


// emit active users to all connected clients
export const emitActiveUsers = async (io) => {
    try {
        const activeUsers = await prisma.user.count({
            where: {
                currentlyActive: true,
                role: 'USER'
            }
        })

        io.emit(SOCKET_EVENTS.ACTIVE_USERS, activeUsers)

        return activeUsers;

    } catch (error) {
        console.error("Error emitting active users:", error);
        io.emit(SOCKET_EVENTS.ACTIVE_USERS, 0)
    }
}


// ===============================================================
// RESTAURANTS
// ===============================================================


// emit current active restaurants to all connected clients
export const emitCurrentActiveRestaurants = async (io) => {
    try {
        const currentActiveRestaurants = await prisma.user.findMany({
            where: {
                currentlyActive: true,
                role: 'RESTAURANT'
            }
        })

        io.emit(SOCKET_EVENTS.CURRENT_ACTIVE_RESTAURANTS, currentActiveRestaurants.length)
        
        return currentActiveRestaurants.length;

    } catch (error) {
        console.error("Error emitting current active restaurants:", error);
        io.emit(SOCKET_EVENTS.CURRENT_ACTIVE_RESTAURANTS, 0)
    }
}


// ===============================================================
// ORDERS
// ===============================================================


// emit orders in last 24 hours
export const emitOrdersInLast24Hours = async (io) => {
    try {
        const ordersInLast24Hours = await prisma.order.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    lte: new Date(new Date().setHours(23, 59, 59, 999))
                }
            }
        })

        io.emit(SOCKET_EVENTS.ORDERS_IN_LAST_24_HOURS, ordersInLast24Hours)

        return ordersInLast24Hours;

    } catch (error) {
        console.error("Error emitting orders in last 24 hours:", error);
        io.emit(SOCKET_EVENTS.ORDERS_IN_LAST_24_HOURS, 0)
    }
}

// emit cancelled / failed orders in last 24 hours
export const emitCancelledFailedOrdersInLast24Hours = async (io) => {
    try {
        const cancelledFailedOrdersInLast24Hours = await prisma.order.count({
            where: {
                status: {
                    in: ['CANCELLED', 'FAILED']
                },
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    lte: new Date(new Date().setHours(23, 59, 59, 999))
                }
            }
        })

        io.emit(SOCKET_EVENTS.CANCELLED_FAILED_ORDERS_IN_LAST_24_HOURS, cancelledFailedOrdersInLast24Hours)

        return cancelledFailedOrdersInLast24Hours;

    } catch (error) {
        console.error("Error emitting cancelled / failed orders in last 24 hours:", error);
        io.emit(SOCKET_EVENTS.CANCELLED_FAILED_ORDERS_IN_LAST_24_HOURS, 0)
    }
}

// emit total revenue in last 24 hours
export const emitTotalRevenueInLast24Hours = async (io) => {
    try {
        const totalRevenueInLast24Hours = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    lte: new Date(new Date().setHours(23, 59, 59, 999))
                }
            },
            include: {
                payment: true
            }
        });

        io.emit(SOCKET_EVENTS.TOTAL_REVENUE_IN_LAST_24_HOURS, totalRevenueInLast24Hours.reduce((acc, order) => acc + order.payment.amount, 0));

        return totalRevenueInLast24Hours.reduce((acc, order) => acc + order.payment.amount, 0);

    } catch (error) {
        console.error("Error emitting total revenue in last 24 hours:", error);
        io.emit(SOCKET_EVENTS.TOTAL_REVENUE_IN_LAST_24_HOURS, 0);
    }
}

// ===============================================================
// PRODUCTS
// ===============================================================


// emit active products
export const emitActiveProducts = async (io) => {
    try {
        const activeProducts = await prisma.product.count({
            where: {
                status: 'ACTIVE'
            }
        })

        io.emit(SOCKET_EVENTS.ACTIVE_PRODUCTS, activeProducts)

        return activeProducts;

    } catch (error) {
        console.error("Error emitting active products:", error);
        io.emit(SOCKET_EVENTS.ACTIVE_PRODUCTS, 0)
    }
}