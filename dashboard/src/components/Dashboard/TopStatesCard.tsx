
const TopStatesCard = ({ topStates }: { topStates: any }) => {

    console.log(topStates);

    return (
        <div className='w-full h-full'>
            <div className='flex flex-col justify-center rounded-3xl px-3 gap-3'>
                <div className='text-sm'>
                    <div className='text-lg font-semibold'>
                        Top States
                    </div>
                </div>
                <div className='flex flex-col gap-3'>
                    <div className='flex items-center justify-between bg-light rounded-3xl py-2 px-3'>
                        <div className='flex items-center gap-2 '>
                            <div className='w-2 h-2 bg-primary rounded-full'></div>
                            <div className='text-sm font-semibold'>Total Orders Today</div>
                        </div>
                        <div className='text-sm font-semibold'>
                            {topStates?.totalOrdersToday}
                        </div>
                    </div>
                    <div className='flex items-center justify-between bg-light rounded-3xl py-2 px-3'>
                        <div className='flex items-center gap-2 '>
                            <div className='w-2 h-2 bg-primary rounded-full'></div>
                            <div className='text-sm font-semibold'>Total Revenue Today</div>
                        </div>
                        <div className='text-sm font-semibold'>
                            {topStates?.totalRevenueToday}
                        </div>
                    </div>
                    <div className='flex items-center justify-between bg-light rounded-3xl py-2 px-3'>
                        <div className='flex items-center gap-2 '>
                            <div className='w-2 h-2 bg-primary rounded-full'></div>
                            <div className='text-sm font-semibold'>Active Products</div>
                        </div>
                        <div className='text-sm font-semibold'>
                            {topStates?.activeProducts}
                        </div>
                    </div>
                    <div className='flex items-center justify-between bg-light rounded-3xl py-2 px-3'>
                        <div className='flex items-center gap-2 '>
                            <div className='w-2 h-2 bg-primary rounded-full'></div>
                            <div className='text-sm font-semibold'>Cancelled / Failed Orders</div>
                        </div>
                        <div className='text-sm font-semibold'>
                            {topStates?.cancelledOrders}
                        </div>
                    </div>
                </div>
            </div>
            <div>
                
            </div>
        </div>
    )
}

export default TopStatesCard
