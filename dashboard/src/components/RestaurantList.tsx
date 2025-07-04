import { motion, AnimatePresence } from 'framer-motion';

interface Restaurant {
  id: number;
  email: string;
  restaurantProfile?: {
    name: string;
    logo?: string;
  };
}

interface RestaurantListProps {
  restaurants: Restaurant[];
}

const RestaurantList = ({ restaurants }: RestaurantListProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="bg-[var(--color-secondary)] rounded-xl shadow p-4 mb-4 h-56 flex flex-col"
      >
        <h2 className="text-lg font-bold text-[var(--color-dark)] font-saira mb-2">All Restaurants</h2>
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <ul className="space-y-2">
            {restaurants.map((restaurant) => (
              <li key={restaurant.id} className="bg-[var(--color-light)] rounded p-2 flex items-center gap-2 text-[var(--color-dark)] shadow-sm">
                {restaurant.restaurantProfile?.logo && (
                  <img src={restaurant.restaurantProfile.logo} alt={restaurant.restaurantProfile.name} className="w-6 h-6 rounded-full object-cover" />
                )}
                <span>{restaurant.restaurantProfile?.name || restaurant.email}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RestaurantList; 