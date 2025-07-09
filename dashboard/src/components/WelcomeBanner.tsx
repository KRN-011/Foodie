import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeBannerProps {
  user: { name: string; role: 'ADMIN' | 'RESTAURANT' };
}

const roleText = {
  ADMIN: 'Admin',
  RESTAURANT: 'Restaurant',
};

const WelcomeBanner = ({ user }: WelcomeBannerProps) => {
  return (
    <AnimatePresence>
      <motion.div
        key={user.role}
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.7, type: 'spring' }}
        className="w-full bg-primary rounded-b-2xl shadow-md p-6 flex flex-col items-center justify-center mb-4"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-dark mb-2 font-saira">
          Welcome, <span className="text-tertiary">{user.name}</span>!
        </h1>
        <p className="text-muted text-base md:text-lg font-medium">
          You are logged in as <span className="text-quaternary">{roleText[user.role]}</span>
        </p>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomeBanner; 