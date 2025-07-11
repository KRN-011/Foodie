
const WelcomeBoard = ({ user }: { user: any }) => {

    const isAdmin = user?.role === 'ADMIN'
    const restaurantName = user?.restaurantProfile?.name || user?.email
    const adminName = user?.username

    return (
        <div className='w-full h-full'>
            <div className='flex flex-col items-center justify-center rounded-3xl p-4'>
                <div className='text-center text-sm'>
                    {isAdmin ? (
                        <div className='flex flex-col items-center justify-center gap-3'>
                            <div className='text-lg'>
                                Welcome back, <span className='font-bold'>{adminName}!</span> 
                            </div>
                            <div className='text-sm'>
                            👋 Here's your daily overview — manage restaurants, monitor orders, and keep everything running smoothly.
                            </div>

                        </div>
                    ) : (
                        <div className='flex flex-col items-center justify-center gap-3'>
                            <div className='text-lg'>
                                Welcome back, <span className='font-bold'>{restaurantName}!</span> 
                            </div>
                            <div className='text-sm'>
                            👋 Check today’s orders, update your menu, and keep your customers satisfied.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default WelcomeBoard
