import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: number;
  name: string;
  price: number;
  status: string;
}

interface ProductSummaryProps {
  products: Product[];
}

const ProductSummary = ({ products }: ProductSummaryProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="bg-[var(--color-secondary)] rounded-xl shadow p-4 mb-4 h-72 flex flex-col"
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-[var(--color-dark)] font-saira">Products</h2>
          <span className="text-[var(--color-tertiary)] font-semibold">{products.length} total</span>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <ul className="space-y-2">
            {products.map((product) => (
              <li key={product.id} className="bg-[var(--color-light)] rounded p-2 flex flex-col shadow-sm">
                <span className="font-semibold text-[var(--color-dark)]">{product.name}</span>
                <span className="text-xs text-[var(--color-muted)]">${product.price} • {product.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductSummary; 