import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import RegisterRestaurant from './pages/RegisterRestaurant';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Users from './pages/Users';
import Restaurants from './pages/Restaurants';
import Orders from './pages/Orders';
import ProtectedRoutes from './components/ProtectedRoutes';
import AuthRouteHandler from './components/AuthProtectedRoutes';

const App = () => {

  const location = useLocation();
  const hideSidebarRoutes = ['/login', '/register'];

  const isSidebarVisible = !hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex flex-1 h-full min-h-screen">
      {isSidebarVisible && <Sidebar />}
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route element={<AuthRouteHandler />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterRestaurant />} />
          </Route>
          <Route element={<ProtectedRoutes />}>
            <Route path="/products" element={<Products />} />
            <Route path="/users" element={<Users />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/orders" element={<Orders />} />
          </Route>
        </Routes>
      </div>
    </div>
  )
}

export default App
