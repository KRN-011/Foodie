
import React from 'react'
import { CartProvider } from '../contexts/cartContext'
import { UserProvider } from '../contexts/userContext'
import { OrderProvider } from '../contexts/orderContext'

const ProviderWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <CartProvider>
            <UserProvider>
                <OrderProvider>
                    {children}
                </OrderProvider>
            </UserProvider>
        </CartProvider>
    )
}

export default ProviderWrapper
