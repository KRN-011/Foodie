import React, { createContext, useContext, useEffect, useState } from "react";
import { getCart } from "../services/apiService";



const CartContext = createContext({
    cartCount: 0,
    refreshCart: () => {}
});

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);

    // fetch cart count on mount
    useEffect(() => {
        fetchCartCount();
    }, [])

    const fetchCartCount = async () => {
        try {
            const response = await getCart();
            if (response.success) {
                setCartCount(response.cart.cartItems.length);
            }
        } catch (error) {
            console.error(error);
            setCartCount(0);
        }
    }

    // Call this after add/remove from cart
    const refreshCart = () => fetchCartCount();

    return (
        <CartContext.Provider value={{ cartCount, refreshCart }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    return useContext(CartContext);
}