import api from "../lib/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;



// ===========================================================
// Authentication API
// ===========================================================



// register user
export const registerUser = async (userData: any) => {
    try {
        const response = await api.post(`${API_BASE_URL}/auth/register`, userData);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
}

// login user
export const loginUser = async (userData: any) => {
    try {
        const response = await api.post(`${API_BASE_URL}/auth/login`, userData);
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
}

// logout user
export const logoutUser = async () => {
    try {
        const response = await api.post(`${API_BASE_URL}/auth/logout`);
        return response.data;
    } catch (error) {
        console.error("Error logging out:", error);
        throw error;
    }
}

// get user
export const getUser = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/auth/me`);
        return response.data;
    } catch (error) {
        console.error("Error getting user:", error);
        throw error;
    }
}



// ===========================================================
// Cart API
// ===========================================================



// get cart
export const getCart = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/cart/get`);
        return response.data;
    } catch (error) {
        console.error("Error getting cart:", error);
        throw error;
    }
}

// add to cart
export const addToCart = async (productId: number, quantity: number) => {
    try {
        const response = await api.post(`${API_BASE_URL}/cart/add-to-cart`, { productId, quantity });
        return response.data;
    } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
    }
}

// delete cart item
export const deleteCartItem = async (cartItemId: number) => {
    try {
        const response = await api.delete(`${API_BASE_URL}/cart/delete-cart-item/${cartItemId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting cart item:", error);
        throw error;
    }
}

// clear cart
export const clearCart = async () => {
    try {
        const response = await api.delete(`${API_BASE_URL}/cart/clear-cart`);
        return response.data;
    } catch (error) {
        console.error("Error clearing cart:", error);
        throw error;
    }
}

// update cart item quantity
export const updateCartItemQuantity = async (cartItemId: number, quantity: number) => {
    try {
        const response = await api.put(`${API_BASE_URL}/cart/update-cart-item-quantity/${cartItemId}`, { quantity });
        return response.data;
    } catch (error) {
        console.error("Error updating cart item quantity:", error);
        throw error;
    }
}

// get all products
export const getAllProducts = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/products/all`);
        return response.data;
    } catch (error) {
        console.error("Error getting all products:", error);
        throw error;
    }
}

// get all categories
export const getAllCategories = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/products/categories`);
        return response.data;
    } catch (error) {
        console.error("Error getting all categories:", error);
        throw error;
    }
}



// ===========================================================
// Address API
// ===========================================================



// create address
export const createAddress = async (addressData: any) => {
    try {
        const response = await api.post(`${API_BASE_URL}/address/create`, addressData);
        return response.data;
    } catch (error) {
        console.error("Error creating address:", error);
        throw error;
    }
}

// get all addresses
export const getAllAddresses = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/address/all`);
        return response.data;
    } catch (error) {
        console.error("Error getting all addresses:", error);
        throw error;
    }
}

// update address
export const updateAddress = async (addressId: number, addressData: any) => {
    try {
        const response = await api.put(`${API_BASE_URL}/address/update/${addressId}`, addressData);
        return response.data;
    } catch (error) {
        console.error("Error updating address:", error);
        throw error;
    }
}

// delete address
export const deleteAddress = async (addressId: number) => {
    try {
        const response = await api.delete(`${API_BASE_URL}/address/delete/${addressId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting address:", error);
        throw error;
    }
}



// ===========================================================
// Order API
// ===========================================================



// create razorpay order
export const createRazorpayOrder = async (amount: number) => {
    try {
        const response = await api.post(`${API_BASE_URL}/order/create-razorpay-order`, { amount });
        return response.data;
    } catch (error) {
        console.error("Error creating razorpay order:", error);
        throw error;
    }
}

// verify razorpay order
export const verifyRazorpayOrder = async (data: any) => {
    try {
        const response = await api.post(`${API_BASE_URL}/order/verify-razorpay-order`, { data });
        return response.data;
    } catch (error) {
        console.error("Error verifying razorpay order:", error);
        throw error;
    }
}

// create order
export const createOrder = async (orderData: any) => {
    try {
        const response = await api.post(`${API_BASE_URL}/order/create-order`, orderData);
        return response.data;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
}

// get orders by user id
export const getOrdersByUserId = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/order/get-orders`);
        return response.data;
    } catch (error) {
        console.error("Error getting orders by user id:", error);
        throw error;
    }
}

// get order by order id
export const getOrderById = async (orderId: string) => {
    try {
        const response = await api.get(`${API_BASE_URL}/order/get-order/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Error getting order by order id:", error);
        throw error;
    }
}

// ===========================================================
// Miscellaneous API
// ===========================================================



// get address details by lat and long
export const getAddressDetailsByLatLong = async (lat: number, long: number) => {
    try {
        const response = await api.get(`${API_BASE_URL}/miscellaneous/get-address-details?lat=${lat}&long=${long}`);
        return response.data;
    } catch (error) {
        console.error("Error getting address details by lat and long:", error);
        throw error;
    }
}