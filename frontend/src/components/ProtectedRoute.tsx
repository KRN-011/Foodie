import { useUser } from '../contexts/userContext';
import { Navigate, Outlet } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';


const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useUser();

    if (isLoading) {
        return <LoadingSpinner />
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }

    return <Outlet />
}

export default ProtectedRoute;