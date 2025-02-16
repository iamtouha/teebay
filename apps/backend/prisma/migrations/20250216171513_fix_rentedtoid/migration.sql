/*
  Warnings:

  - You are about to drop the column `rentedTo` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `soldTo` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_rentedTo_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_soldTo_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "rentedTo",
DROP COLUMN "soldTo",
ADD COLUMN     "rentedToId" INTEGER,
ADD COLUMN     "soldToId" INTEGER;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_rentedToId_fkey" FOREIGN KEY ("rentedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_soldToId_fkey" FOREIGN KEY ("soldToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
