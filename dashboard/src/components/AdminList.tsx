import { motion, AnimatePresence } from 'framer-motion';

interface Admin {
  id: number;
  email: string;
}

interface AdminListProps {
  admins: Admin[];
}

const AdminList = ({ admins }: AdminListProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="bg-[var(--color-secondary)] rounded-xl shadow p-4 mb-4 h-56 flex flex-col"
      >
        <h2 className="text-lg font-bold text-[var(--color-dark)] font-saira mb-2">All Admins</h2>
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <ul className="space-y-2">
            {admins.map((admin) => (
              <li key={admin.id} className="bg-[var(--color-light)] rounded p-2 text-[var(--color-dark)] shadow-sm">
                {admin.email}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminList; 