import prisma from '../lib/prismaClient.js';

// =====================================================================
// Product Helper API Logics
// =====================================================================

// Fill cart with products
export const fillCartWithProducts = async (req, res) => {
    try {
        const { quantity } = req.params;
        const { id } = req.user;

        const products = await prisma.product.findMany({
            where: {
                status: 'ACTIVE',
            },
            take: Number(quantity),
        });

        if (!products.length) {
            return res
                .status(404)
                .json({ success: false, message: 'No products found' });
        }

        // 2. Find or create the user's cart
        let cart = await prisma.cart.findFirst({
            where: { userId: id },
            include: { cartItems: true },
        });
        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: id, cartTotal: 0 },
            });
        }

        // 3. Add each product to the cart or update quantity if already exists
        for (const product of products) {
            await prisma.cartItem.upsert({
                where: {
                    cartId_productId: {
                        cartId: cart.id,
                        productId: product.id,
                    },
                },
                update: {
                    quantity: { increment: 1 },
                },
                create: {
                    cartId: cart.id,
                    productId: product.id,
                    quantity: 1,
                }
            })
        }

        // 4. Recalculate cart total
        const updatedCart = await prisma.cart.findUnique({
            where: { id: cart.id },
            include: {
                cartItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        res.status(200).json({
            success: true,
            message: 'Cart filled with products',
            cart: updatedCart,
        });
    } catch (error) {
        console.error('Error filling cart with products:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fill cart with products',
            error: error.message,
        });
    }
};
