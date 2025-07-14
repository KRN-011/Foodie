import prisma from '../lib/prismaClient.js';


// top states
export const getTopStates = async (req, res) => {
    try {
        // Fetch data directly from the database, do not emit events
        const ordersInLast24Hours = await prisma.order.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    lte: new Date(new Date().setHours(23, 59, 59, 999))
                }
            }
        });

        const totalRevenueOrders = await prisma.order.findMany({
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
        const totalRevenueInLast24Hours = totalRevenueOrders.reduce((acc, order) => acc + (order.payment?.amount || 0), 0);

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
        });

        const activeProducts = await prisma.product.count({
            where: {
                status: 'ACTIVE'
            }
        });

        const activeUsers = await prisma.user.count({
            where: {
                currentlyActive: true,
                role: 'USER'
            }
        });

        const currentActiveRestaurants = await prisma.user.count({
            where: {
                currentlyActive: true,
                role: 'RESTAURANT'
            }
        });

        const topStates = {
            ordersInLast24Hours,
            totalRevenueInLast24Hours,
            cancelledFailedOrdersInLast24Hours,
            activeProducts,
            activeUsers,
            currentActiveRestaurants
        };

        res.status(200).json({
            success: true,
            message: "Top states fetched successfully",
            data: topStates
        });

    } catch (error) {
        console.error("Error getting top states:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}