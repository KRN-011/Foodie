import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Cart from './pages/Cart';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderConfirmed from './pages/OrderConfirmed';
import ProtectedRoute from './components/ProtectedRoute';
import AuthRouteHandler from './components/AuthRouteHandler';

function App() {

  return (
    <div className="flex flex-col flex-1 h-full min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<AuthRouteHandler />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/order-confirmed/:orderId" element={<OrderConfirmed />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
