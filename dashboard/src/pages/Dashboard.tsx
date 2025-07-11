import { useEffect, useState } from 'react'

// Components
import WelcomeBoard from '../components/Dashboard/WelcomeBoard'
import { useUser } from '../contexts/userContext'
import TopStatesCard from '../components/Dashboard/TopStatesCard'
import { getTopStates } from '../services/apiService'

const Dashboard = () => {

    const { user } = useUser()

    const [topStates, setTopStates] = useState<any>(null);

    const fetchTopStates = async () => {
        try {
            const response = await getTopStates();

            if (response.success) {
                setTopStates(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchTopStates();
    }, [])

    return (
        <div className="w-full h-screen overflow-y-auto custom-scrollbar bg-[var(--color-light)] p-3 md:p-6 flex flex-col gap-3">
            {/* Mobile View */}
            <div className='md:hidden flex flex-col gap-3'>
                <div className='flex items-center justify-between bg-quaternary rounded-3xl p-4'>
                    <WelcomeBoard user={user} />
                </div>
                <div className='flex flex-col gap-4'>
                    <div className='flex items-center justify-center bg-quaternary rounded-3xl p-4'>
                        {topStates && <TopStatesCard topStates={topStates} />}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Dashboard
