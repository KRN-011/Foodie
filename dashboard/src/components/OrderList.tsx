import { motion, AnimatePresence } from 'framer-motion';

interface Order {
  id: number;
  orderId: string;
  receiverName: string;
  status: string;
  createdAt: string;
}

interface OrderListProps {
  orders: Order[];
}

const OrderList = ({ orders }: OrderListProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="bg-[var(--color-secondary)] rounded-xl shadow p-4 mb-4 h-56 flex flex-col"
      >
        <h2 className="text-lg font-bold text-[var(--color-dark)] font-saira mb-2">Recent Orders</h2>
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <ul className="space-y-2">
            {orders.map((order) => (
              <li key={order.id} className="bg-[var(--color-light)] rounded p-2 text-[var(--color-dark)] shadow-sm">
                <span className="font-semibold">Order #{order.orderId}</span> for <span className="font-medium">{order.receiverName}</span>
                <span className="block text-xs text-[var(--color-muted)]">{order.status} • {new Date(order.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OrderList; 