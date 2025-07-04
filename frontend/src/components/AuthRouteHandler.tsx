import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../contexts/userContext';
import LoadingSpinner from './LoadingSpinner';

const AuthRouteHandler = () => {
    const { isAuthenticated, isLoading } = useUser();

    if (isLoading) {
        return <LoadingSpinner />
    }

    if (isAuthenticated) {
        return <Navigate to="/" />
    }

    return <Outlet />
}

export default AuthRouteHandler
