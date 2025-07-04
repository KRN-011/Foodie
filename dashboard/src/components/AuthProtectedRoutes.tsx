import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../contexts/userContext';

const AuthRouteHandler = () => {
    const { isAuthenticated, isLoading } = useUser();

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isAuthenticated) {
        return <Navigate to="/" />
    }

    return <Outlet />
}

export default AuthRouteHandler
