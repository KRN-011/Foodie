import api from "../lib/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;



// ===========================================================
// Admin API
// ===========================================================



// login admin
export const loginAdmin = async (adminData: any) => {
    try {
        const response = await api.post(`${API_BASE_URL}/admin/login`, adminData);
        return response.data;
    } catch (error) {
        console.error("Error logging in admin:", error);
        throw error;
    }
}

// logout admin
export const logoutAdmin = async () => {
    try {
        const response = await api.post(`${API_BASE_URL}/admin/logout`);
        return response.data;
    } catch (error) {
        console.error("Error logging out admin:", error);
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

// get all restaurants
export const getAllRestaurants = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/admin/restaurants`);
        return response.data;
    } catch (error) {
        console.error("Error getting all products:", error);
        throw error;
    }
}

// get products by restaurant id
export const getProductsByRestaurantId = async (restaurantId: string) => {
    try {
        const response = await api.get(`${API_BASE_URL}/admin/products/restaurant/${restaurantId}`);
        return response.data;
    } catch (error) {
        console.error("Error getting products by restaurant id:", error);
        throw error;
    }
}

// get all admins
export const getAllAdmins = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/admin/all`);
        return response.data;
    } catch (error) {
        console.error("Error getting all admins:", error);
        throw error;
    }
}

// get all audit logs
export const getAllAuditLogs = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/admin/audit-logs`);
        return response.data;
    } catch (error) {
        console.error("Error getting all audit logs:", error);
        throw error;
    }
}

// add product
export const addProduct = async (productData: any) => {
    try {
        const response = await api.post(`${API_BASE_URL}/products/create`, productData);
        return response.data;
    } catch (error) {
        console.error("Error adding product:", error);
        throw error;
    }
}

// update product
export const updateProduct = async (productId: number, productData: any) => {
    try {
        const response = await api.put(`${API_BASE_URL}/products/update/${productId}`, productData);
        return response.data;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
}

// delete product
export const deleteProduct = async (productId: number) => {
    try {
        const response = await api.delete(`${API_BASE_URL}/products/delete/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting product:", error);
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

// create category
export const createCategory = async (categoryData: any) => {
    try {
        const response = await api.post(`${API_BASE_URL}/products/categories/create`, categoryData);
        return response.data;
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
}

// get all users
export const getAllUsers = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/admin/users`);
        return response.data;
    } catch (error) {
        console.error("Error getting all users:", error);
        throw error;
    }
}

// update user by id
export const updateUser = async (id: number, userData: any) => {
    try {
        const response = await api.put(`${API_BASE_URL}/admin/update-user/${id}`, userData);
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
}

// delete user by id
export const deleteUserById = async (id: number) => {
    try {
        const response = await api.delete(`${API_BASE_URL}/admin/delete-user/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
}



// ===========================================================
// Restaurant API
// ===========================================================



// register restaurant
export const registerRestaurant = async (restaurantData: any) => {
    try {
        const response = await api.post(`${API_BASE_URL}/restaurant/register`, restaurantData);
        return response.data;
    } catch (error) {
        console.error("Error registering restaurant:", error);
        throw error;
    }
}

// login restaurant
export const loginRestaurant = async (restaurantData: any) => {
    try {
        const response = await api.post(`${API_BASE_URL}/restaurant/login`, restaurantData);
        return response.data;
    } catch (error) {
        console.error("Error logging in restaurant:", error);
        throw error;
    }
}

// logout restaurant
export const logoutRestaurant = async () => {
    try {
        const response = await api.post(`${API_BASE_URL}/restaurant/logout`);
        return response.data;
    } catch (error) {
        console.error("Error logging out restaurant:", error);
        throw error;
    }
}

// get restaurant profile
export const getRestaurantProfile = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/restaurant/profile`);
        return response.data;
    } catch (error) {
        console.error("Error getting restaurant profile:", error);
        throw error;
    }
}



// ===========================================================
// Order API
// ===========================================================



// get all orders
export const getAllOrders = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/admin/orders`);
        return response.data;
    } catch (error) {
        console.error("Error getting all orders:", error);
        throw error;
    }
}

// get orders by restaurant id
export const getOrdersByRestaurantId = async (restaurantId: string) => {
    try {
        const response = await api.get(`${API_BASE_URL}/admin/orders/restaurant/${restaurantId}`);
        return response.data;
    } catch (error) {
        console.error("Error getting orders by restaurant id:", error);
        throw error;
    }
}


// update order status
export const updateOrderStatus = async (orderId: string, status: string) => {
    try {
        const response = await api.put(`${API_BASE_URL}/order/update-order-status/${orderId}`, { status: status });
        return response.data;
    } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
    }
}



// ===========================================================
// Combined API
// ===========================================================


// get top states
export const getTopStates = async () => {
    try {
        const response = await api.get(`${API_BASE_URL}/combined/top-states`);
        return response.data;
    } catch (error) {
        console.error("Error getting top states:", error);
        throw error;
    }
}