import prisma from '../lib/prismaClient.js';

// create address
export const createAddress = async (req, res) => {
    try {
        const { address, landmark, area, houseNumber, city, state, country, postalCode, latitude, longitude } = req.body;
        const { id } = req.user;

        const newAddress = await prisma.address.create({
            data: {
                address,
                landmark,
                area,
                houseNumber,
                city,
                state,
                country,
                postalCode,
                latitude,
                longitude,
                userId: id,
            },
        });

        res.status(201).json({
            success: true,
            message: 'Address created successfully',
            address: newAddress,
        });
    } catch (error) {
        console.error('Error creating address:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create address',
            error: error.message,
        });
    }
};

// get all addresses
export const getAllAddresses = async (req, res) => {    
    try {
        const { id } = req.user;

        const addresses = await prisma.address.findMany({
            where: { userId: id },
            where: { deleted: false },
        });

        res.status(200).json({
            success: true,
            message: 'Addresses fetched successfully',
            addresses,
        });
    } catch (error) {
        console.error('Error getting all addresses:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get all addresses',
            error: error.message,
        });
    }
};

// update address
export const updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const { address, landmark, area, houseNumber, city, state, country, postalCode, latitude, longitude } = req.body;

        const updatedAddress = await prisma.address.update({
            where: { id: Number(id) },
            data: { address, landmark, area, houseNumber, city, state, country, postalCode, latitude, longitude },
        });

        res.status(200).json({
            success: true,
            message: 'Address updated successfully',
            address: updatedAddress,
        });
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update address',
            error: error.message,
        });
    }
}

// delete address
export const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAddress = await prisma.address.update({
            where: { id: Number(id) },
            data: { deleted: true },
        });

        res.status(200).json({
            success: true,
            message: 'Address deleted successfully',
            address: deletedAddress,
        });
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete address',
            error: error.message,
        });
    }
}