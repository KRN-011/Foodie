import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getUser, loginAdmin, logoutAdmin, loginRestaurant, logoutRestaurant } from "../services/apiService";
import { toast } from "react-toastify";

type UserContextType = {
    user: any;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isRestaurant: boolean;
    isLoading: boolean;
    login: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    getUserInfo: () => Promise<any>;
};

const UserContext = createContext<UserContextType>({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    isRestaurant: false,
    isLoading: true,
    login: async () => { },
    logout: async () => { },
    getUserInfo: async () => { },
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isRestaurant, setIsRestaurant] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeUser = async () => {
            setIsLoading(true);
            try {
                const token = Cookies.get("dashboardToken");
                if (token) {
                    const response = await getUser();
                    setUser(response.user);
                    setIsAuthenticated(true);
                    setIsAdmin(response.user.role === "ADMIN");
                    setIsRestaurant(response.user.role === "RESTAURANT");
                    Cookies.set('dashboardUser', JSON.stringify(response.user));
                }
            } catch (error) {
                setUser(null);
                setIsAuthenticated(false);
                setIsAdmin(false);
                setIsRestaurant(false);
            } finally {
                setIsLoading(false);
            }
        }

        initializeUser();
    }, [])

    // login
    const login = async (data: any) => {
        setIsLoading(true);
        try {
            const response = await (data.role === "ADMIN" ? loginAdmin(data) : loginRestaurant(data));
            if (response.success) {
                setUser(response.user);
                setIsAuthenticated(true);
                setIsAdmin(response.user.role === "ADMIN");
                setIsRestaurant(response.user.role === "RESTAURANT");
                toast.success(response.message);
                Cookies.set('dashboardToken', response.token);
                Cookies.set('dashboardUser', JSON.stringify(response.user));
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    // logout
    const logout = async () => {
        try {
            setIsLoading(true);
            const response = await (isAdmin ? logoutAdmin() : logoutRestaurant());
            if (response.success) {
                setUser(null);
                setIsAuthenticated(false);
                setIsAdmin(false);
                setIsRestaurant(false);
                toast.success(response.message);
                Cookies.remove('dashboardToken');
                Cookies.remove('dashboardUser');
            }
        } catch (error) {
            console.error("Error logging out:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    // get user
    const getUserInfo = async () => {
        try {
            setIsLoading(true);
            const response = await getUser();
            setUser(response.user);
            setIsAuthenticated(true);
            setIsAdmin(response.user.role === "ADMIN");
            setIsRestaurant(response.user.role === "RESTAURANT");
            return response.user;
        } catch (error) {
            console.error("Error getting user:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <UserContext.Provider value={{ user, isAuthenticated, isAdmin, isRestaurant, isLoading, login, logout, getUserInfo }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    return useContext(UserContext);
}