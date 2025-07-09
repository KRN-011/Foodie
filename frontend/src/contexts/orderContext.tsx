import { createContext, useContext, useEffect, useState } from "react";
import { getOrdersByUserId } from "../services/apiService";


const OrderContext = createContext({
    orders: [] as any[],
    setOrders: (orders: any[]) => { },
    isLiveOrderExists: () => false as boolean,
    refreshOrders: () => { }
})

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
    const [orders, setOrders] = useState<any[]>([]);

    const fetchOrders = async () => {
        try {
            const response = await getOrdersByUserId();

            if (response.success) {
                setOrders(response.orders);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, [])

    const isLiveOrderExists = () => {
        return orders.some((order: any) => order.status === "PENDING" || order.status === "CONFIRMED" || order.status === "PREPARING" || order.status === "OUT_FOR_DELIVERY");
    }

    const refreshOrders = () => {
        fetchOrders();
    }

    return (
        <OrderContext.Provider value={{ orders, setOrders, isLiveOrderExists, refreshOrders }}>
            {children}
        </OrderContext.Provider>
    )
}

export const useOrder = () => {
    return useContext(OrderContext);
}