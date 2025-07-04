import { createContext, useContext, useEffect, useState } from "react";
import { getUser, loginUser, logoutUser } from "../services/apiService";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

type UserContextType = {
    user: any | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (userData: any) => Promise<void>;
    logout: () => Promise<void>;
    getUserInfo: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: async () => {},
    logout: async () => {},
    getUserInfo: async () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeUser = async () => {
            setIsLoading(true);
            try {
                // Only try if you have a token
                if (Cookies.get('token')) {
                    const response = await getUser();
                    setUser(response.user);
                    Cookies.set('user', JSON.stringify(response.user));
                    setIsAuthenticated(true);
                }
            } catch (error) {
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };
        initializeUser();
    }, []);

    // login
    const login = async (userData: any) => {
        setIsLoading(true);
        try {
            const response = await loginUser(userData);
            if (response.success) {
                setUser(response.user);
                setIsAuthenticated(true);
                toast.success(response.message);
                Cookies.set('token', response.token);
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
            const response = await logoutUser();
            if (response.success) {
                setUser(null);
                setIsAuthenticated(false);
                toast.success(response.message);
                Cookies.remove('token');
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
            return response.user;
        } catch (error) {
            console.error("Error getting user:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <UserContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, getUserInfo }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    return useContext(UserContext);
}