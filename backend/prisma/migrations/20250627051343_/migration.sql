/*
  Warnings:

  - Changed the type of `cartTotal` on the `Cart` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `price` on the `OrderItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `price` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "cartTotal",
ADD COLUMN     "cartTotal" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "price",
ADD COLUMN     "price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "price",
ADD COLUMN     "price" INTEGER NOT NULL;
