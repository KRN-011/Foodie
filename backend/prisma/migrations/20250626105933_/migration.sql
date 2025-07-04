-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Pizza', 'Burgers', 'Sandwiches', 'Chinese', 'Indian', 'Italian', 'Salads', 'Desserts', 'Bakery', 'Breakfast', 'Fast_Food', 'Beverages', 'Snacks', 'Ice_Cream', 'Other');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" "Category";
