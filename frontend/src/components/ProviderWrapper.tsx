
import React from 'react'
import { CartProvider } from '../contexts/cartContext'
import { UserProvider } from '../contexts/userContext'

const ProviderWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <CartProvider>
            <UserProvider>
                {children}
            </UserProvider>
        </CartProvider>
    )
}

export default ProviderWrapper
