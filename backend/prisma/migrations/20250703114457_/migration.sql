/*
  Warnings:

  - You are about to drop the column `restaurantId` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_restaurantId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "restaurantId";

-- CreateTable
CREATE TABLE "_ProductRestaurants" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductRestaurants_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProductRestaurants_B_index" ON "_ProductRestaurants"("B");

-- AddForeignKey
ALTER TABLE "_ProductRestaurants" ADD CONSTRAINT "_ProductRestaurants_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductRestaurants" ADD CONSTRAINT "_ProductRestaurants_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
