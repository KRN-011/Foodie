import prisma from '../lib/prismaClient.js';
import jsonwebtoken from 'jsonwebtoken';

// create product
export const createProduct = async (req, res) => {
    try {
        const {
            name,
            price,
            description,
            ingredients,
            images,
            status,
            categoryId,
            featured,
            restaurantIds,
        } = req.body;
        const { id } = req.user;

        // check if all fields are provided
        if (
            !name ||
            !price ||
            !description ||
            !ingredients ||
            !images ||
            !status ||
            !categoryId
        ) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // create product
        const product = await prisma.product.create({
            data: {
                name,
                price,
                description,
                ingredients,
                images,
                status,
                categoryId: Number(categoryId),
                featured,
                restaurants: {
                    connect: restaurantIds?.map(id => ({ id: Number(id) })) || [],
                }
            },
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product,
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// update product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, ingredients, images, featured, categoryId, restaurantIds, status } = req.body;

        // update product
        const product = await prisma.product.update({
            where: {
                id: Number(id),
            },
            data: {
                name,
                price,
                description,
                ingredients,
                images,
                featured,
                category: {
                    connect: {
                        id: Number(categoryId),
                    }
                },
                restaurants: {
                    connect: restaurantIds.map(id => ({ id: Number(id) })),
                },
                status,
            },
        });

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product,
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// delete product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // delete product
        await prisma.product.update({
            where: {
                id: Number(id),
            },
            data: {
                status: 'DELETED',
            }
        });

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// get all products
export const getAllProducts = async (req, res) => {
    try {
        let products;
        if (req.user.role === 'ADMIN') {
            products = await prisma.product.findMany({
                include: {
                    category: true,
                    restaurants: {
                        include: {
                            restaurantProfile: true,
                        },
                    },
                },
            });
        } else if (req.user.role === 'RESTAURANT') {
            products = await prisma.product.findMany({
                where: { restaurants: { some: { id: Number(req.user.id) } } },
                include: {
                    category: true,
                    restaurants: {
                        include: {
                            restaurantProfile: true,
                        },
                    },
                },
            });
        } else {
            products = await prisma.product.findMany({
                where: {
                    status: 'ACTIVE',
                },
                include: {
                    category: true,
                    restaurants: {
                        include: {
                            restaurantProfile: true,
                        },
                    },
                },
            });
        }

        res.status(200).json({
            success: true,
            message: 'Products fetched successfully',
            products,
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// get product by id
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product fetched successfully',
            product,
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// get all categories or create new category
export const getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();

        res.status(200).json({
            success: true,
            message: 'Categories fetched successfully',
            categories,
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// create category
export const createCategory = async (req, res) => {
    try {
        const { name, image } = req.body;

        // check if name is provided
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Name is required',
            });
        }

        // create category
        const category = await prisma.category.create({
            data: { name, image },
        });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            category,
        });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
