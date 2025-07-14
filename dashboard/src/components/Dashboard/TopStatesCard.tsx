import { MdOutlineRefresh } from "react-icons/md";
import LoadingSkeleton from "../LoadingSkeleton";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const TopStatesCard = ({ topStates, stateLoading, fetchTopStates }: { topStates: any, stateLoading: boolean, fetchTopStates: () => void }) => {
    const prevTopStates = useRef<any>({});

    useEffect(() => {
        if (topStates) {
            prevTopStates.current = topStates;
        }
    }, [topStates]);

    const isInitialLoading = !topStates;

    const cardData = [
        {
            label: 'Total Orders Today',
            value: topStates?.ordersInLast24Hours,
            prev: prevTopStates.current?.ordersInLast24Hours,
            key: 'ordersInLast24Hours',
        },
        {
            label: 'Total Revenue',
            value: topStates?.totalRevenueInLast24Hours,
            prev: prevTopStates.current?.totalRevenueInLast24Hours,
            key: 'totalRevenueInLast24Hours',
        },
        {
            label: 'Active Users',
            value: topStates?.activeUsers,
            prev: prevTopStates.current?.activeUsers,
            key: 'activeUsers',
        },
        {
            label: 'Active Restaurants',
            value: topStates?.currentActiveRestaurants,
            prev: prevTopStates.current?.currentActiveRestaurants,
            key: 'currentActiveRestaurants',
        },
        {
            label: 'Cancelled Failed Orders',
            value: topStates?.cancelledFailedOrdersInLast24Hours,
            prev: prevTopStates.current?.cancelledFailedOrdersInLast24Hours,
            key: 'cancelledFailedOrdersInLast24Hours',
        },
        {
            label: 'Active Products',
            value: topStates?.activeProducts,
            prev: prevTopStates.current?.activeProducts,
            key: 'activeProducts',
        },
    ];

    return (
        <div className='w-full h-full'>
            <div className='flex flex-col justify-center rounded-3xl px-3 gap-3'>
                <div className='text-sm flex items-center justify-between'>
                    <div className="flex items-center gap-2">
                        <div className='text-lg font-semibold'>
                            Top States
                        </div>
                        <div className="flex items-center gap-2">
                            <div className='text-xs font-semibold  bg-red-500 px-2 py-1 rounded-full text-light animate-pulse'>
                                Live
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <motion.button
                            className="flex items-center gap-2 bg-light rounded-full p-2 hover:bg-light/50" 
                            onClick={() => fetchTopStates()} 
                            disabled={stateLoading}
                        >
                            <MdOutlineRefresh size={15} className={`${stateLoading ? 'animate-spin' : ''}`} />
                        </motion.button>
                    </div>
                </div>
                <div className='flex flex-col gap-3 overflow-hidden'>
                    {isInitialLoading ? (
                        Array.from({ length: 6 }).map((_, idx) => (
                            <LoadingSkeleton key={idx} className="flex-1 min-h-9" />
                        ))
                    ) : (
                        cardData.map(card => (
                            <motion.div
                                key={card.key}
                                initial={false}
                                animate={card.value !== card.prev ? { backgroundColor: ["#fff", "#ffefef", "#fff"] } : { backgroundColor: "#fff" }}
                                transition={{ duration: 0.7 }}
                                className='flex items-center justify-between bg-light rounded-3xl py-2 px-3'
                            >
                                <div className='flex items-center gap-2 '>
                                    <motion.div
                                        initial={{ backgroundColor: '#E7CCCC' }}
                                        animate={{ backgroundColor: '#ff6467' }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3, delay: 0.7 }}
                                        className='w-2 h-2 rounded-full'
                                    ></motion.div>
                                    <div className='text-sm font-semibold'>{card.label}</div>
                                </div>
                                <motion.div
                                    key={card.value}
                                    initial={{ scale: 1 }}
                                    animate={card.value !== card.prev ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className='text-sm font-semibold'
                                >
                                    {card.value}
                                </motion.div>
                            </motion.div>
                        ))
                    )}
                </div >
            </div >
        </div >
    )
}

export default TopStatesCard