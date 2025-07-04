-- DropForeignKey
ALTER TABLE "RestaurantProfile" DROP CONSTRAINT "RestaurantProfile_userId_fkey";

-- DropIndex
DROP INDEX "Token_userId_key";

-- AddForeignKey
ALTER TABLE "RestaurantProfile" ADD CONSTRAINT "RestaurantProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
