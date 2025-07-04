import prisma from '../lib/prismaClient.js';

// add to cart
export const addToCart = async (req, res) => {
    try {
        const { id } = req.user;
        const { productId, quantity } = req.body;

        // check if product exists
        const product = await prisma.product.findUnique({
            where: {
                id: Number(productId),
            },
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // check if user already has a cart
        const cart = await prisma.cart.findFirst({
            where: {
                userId: Number(id),
            },
            include: {
                cartItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (cart) {
            // check if product is already in cart
            const existingCartItem = await prisma.cartItem.findFirst({
                where: {
                    cartId: cart.id,
                    productId: Number(productId),
                },
            });

            if (existingCartItem) {
                // update quantity
                const updatedCartItem = await prisma.cartItem.update({
                    where: {
                        id: existingCartItem.id,
                    },
                    data: {
                        quantity: {
                            increment: quantity,
                        },
                    },
                });

                // calculate total price to update cart
                const allPoducts = await prisma.cartItem.findMany({
                    where: {
                        cartId: cart.id,
                    },
                    include: {
                        product: true,
                    },
                });
                let totalPrice = 0;
                allPoducts.forEach((item) => {
                    totalPrice += item.product.price * item.quantity;
                });

                // update cart total
                const updatedCart = await prisma.cart.update({
                    where: {
                        id: cart.id,
                    },
                    data: {
                        cartTotal: totalPrice,
                    },
                    include: {
                        cartItems: {
                            include: {
                                product: true,
                            },
                        },
                    },
                });

                return res.status(200).json({
                    success: true,
                    message: 'Item added to cart',
                    cart: updatedCart,
                });
            }

            // create cart item
            const cartItem = await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: Number(productId),
                    quantity,
                },
            });

            // update cart total
            const updatedCart = await prisma.cart.update({
                where: {
                    id: cart.id,
                },
                data: {
                    cartTotal: {
                        increment: product.price * quantity,
                    },
                },
                include: {
                    cartItems: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

            return res.status(201).json({
                success: true,
                message: 'Item added to cart',
                cart: updatedCart,
            });
        }

        // create cart
        const newCart = await prisma.cart.create({
            data: {
                userId: Number(id),
                cartTotal: product.price * quantity,
            },
        });

        // update cart total
        const updatedCart = await prisma.cart.update({
            where: {
                id: newCart.id,
            },
            data: {
                cartTotal: product.price * quantity,
            },
            include: {
                cartItems: {
                    include: {
                        product: true,
                    }
                }
            }
        });

        // create cart item
        const cartItem = await prisma.cartItem.create({
            data: {
                cartId: newCart.id,
                productId: Number(productId),
                quantity,
            },
        });

        res.status(201).json({
            success: true,
            message: 'Item added to cart',
            cart: updatedCart,
        });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};


// get cart
export const getCart = async (req, res) => {
    try {
        const { id } = req.user;

        // get cart
        const cart = await prisma.cart.findFirst({
            where: {
                userId: Number(id),
            },
            include: {
                cartItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found',
            });
        }

        // Filter out cartItems with quantity 0
        cart.cartItems = cart.cartItems.filter(item => item.quantity > 0);

        res.status(200).json({
            success: true,
            message: 'Cart fetched successfully',
            cart,
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};


// delete cart item
export const deleteCartItem = async (req, res) => {
    try {
        const { cartItemId } = req.params;

        // check if cart item exists
        const existingCartItem = await prisma.cartItem.findUnique({
            where: {
                id: Number(cartItemId),
            },
        });

        if ( !existingCartItem ) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found",
            })
        }

        // delete cart item
        await prisma.cartItem.delete({
            where: {
                id: Number(cartItemId),
            }
        });

        // calculate total price to update cart
        const allProducts = await prisma.cartItem.findMany({
            where: {
                cartId: existingCartItem.cartId,
            },
            include: {
                product: true,
            }
        })

        let totalPrice = 0;
        allProducts.forEach((item) => {
            totalPrice += item.product.price * item.quantity;
        })

        // update cart total
        await prisma.cart.update({
            where: {
                id: existingCartItem.cartId,
            },
            data: {
                cartTotal: totalPrice
            }
        })

        res.status(200).json({
            success: true,
            message: "Cart item deleted successfully",
        })
        
    } catch (error) {
        console.error("Error deleting cart item:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}


// clear cart
export const clearCart = async (req, res) => {
    try {
        const { id } = req.user;

        // get cart
        const cart = await prisma.cart.findFirst({
            where: {
                userId: Number(id),
            },
        });

        if ( !cart ) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            })
        }

        // delete all cart items
        await prisma.cartItem.deleteMany({
            where: {
                cartId: cart.id,
            }
        })

        // update cart total
        await prisma.cart.update({
            where: {
                id: cart.id,
            },
            data: {
                cartTotal: 0,
            }
        })

        res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
        })
    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}


// update cart item quantity
export const updateCartItemQuantity = async (req, res) => {
    try {
        const { cartItemId } = req.params;
        const { quantity } = req.body;

        // check if cart item exists
        const existingCartItem = await prisma.cartItem.findUnique({
            where: {
                id: Number(cartItemId),
            }
        });

        if ( !existingCartItem ) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found",
            })
        }
        
        if (Number(quantity) <= 0) {
            // delete cart item if quantity is zero or less
            await prisma.cartItem.delete({
                where: {
                    id: Number(cartItemId),
                }
            });
        } else {
        // update cart item quantity
            await prisma.cartItem.update({
            where: {
                id: Number(cartItemId),
            },
            data: {
                quantity: Number(quantity),
            },
            include: {
                product: true,
            }
        });
        }

        // update cart total
        const allProducts = await prisma.cartItem.findMany({
            where: {
                cartId: existingCartItem.cartId,
            },
            include: {
                product: true,
            }
        })

        let totalPrice = 0;
        allProducts.forEach((item) => {
            totalPrice += item.product.price * item.quantity;
        })

        // update cart total
        await prisma.cart.update({
            where: {
                id: existingCartItem.cartId,
            },
            data: {
                cartTotal: totalPrice,
            }
        })

        // return response
        res.status(200).json({
            success: true,
            message: Number(quantity) <= 0 ? "Cart item deleted successfully" : "Cart item quantity updated successfully",
        })
    } catch (error) {
        console.error("Error updating cart item quantity:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}