/*
  Warnings:

  - You are about to drop the `Catalouges` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Catalouges";

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ingredients" TEXT[],
    "images" TEXT[],

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
