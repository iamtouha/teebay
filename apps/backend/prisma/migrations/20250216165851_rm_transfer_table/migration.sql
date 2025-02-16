/*
  Warnings:

  - You are about to drop the column `isRented` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Transfer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transfer" DROP CONSTRAINT "Transfer_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "Transfer" DROP CONSTRAINT "Transfer_productId_fkey";

-- DropForeignKey
ALTER TABLE "Transfer" DROP CONSTRAINT "Transfer_sellerId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "isRented",
ADD COLUMN     "rentedAt" TIMESTAMP(3),
ADD COLUMN     "rentedTo" INTEGER,
ADD COLUMN     "soldAt" TIMESTAMP(3),
ADD COLUMN     "soldTo" INTEGER;

-- DropTable
DROP TABLE "Transfer";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_rentedTo_fkey" FOREIGN KEY ("rentedTo") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_soldTo_fkey" FOREIGN KEY ("soldTo") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
