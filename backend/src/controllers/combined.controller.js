import prisma from '../lib/prismaClient.js';


// top states
export const getTopStates = async (req, res) => {
    try {
        let topStates = {};

        // get all states from each modules
        const totalOrdersToday = await prisma.order.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    lte: new Date(new Date().setHours(23, 59, 59, 999)),
                }
            }
        })

        topStates.totalOrdersToday = totalOrdersToday;

        // revenue today
        const ordersToday = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    lte: new Date(new Date().setHours(23, 59, 59, 999)),
                }
            },
            include: {
                payment: true,
            }
        })

        const totalRevenueToday = ordersToday.reduce((acc, order) => acc + (order.payment?.amount || 0), 0);

        topStates.totalRevenueToday = totalRevenueToday;

        // active products
        const activeProducts = await prisma.product.count({
            where: {
                status: 'ACTIVE'
            }
        })

        topStates.activeProducts = activeProducts;

        // Cancelled / failed orders
        const cancelledOrders = await prisma.order.count({
            where: {
                status: {
                    in: ['CANCELLED', 'FAILED']
                }
            }
        })

        topStates.cancelledOrders = cancelledOrders;

        res.status(200).json({
            success: true,
            data: topStates,
            message: 'Top states fetched successfully',
        })
    } catch (error) {
        console.log("Error fetching top states: ", error);
        res.status(500).json({
            success: false,
            message: 'Error fetching top states',
        })
    }
}