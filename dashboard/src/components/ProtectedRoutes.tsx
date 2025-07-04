import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../contexts/userContext";
import Cookies from "js-cookie";

interface ProtectedRoutesProps {
    requiredRole?: 'ADMIN' | 'RESTAURANT';
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ requiredRole }) => {
    const { isAuthenticated, user, isLoading } = useUser();

    const token = Cookies.get('token');

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!isAuthenticated || !token) {
        return <Navigate to="/login" />
    }

    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to="/" />
    }

    return <Outlet />
}

export default ProtectedRoutes;