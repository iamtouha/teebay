/*
  Warnings:

  - You are about to drop the column `rentEndDate` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `rentedAt` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `rentedToId` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_rentedToId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "rentEndDate",
DROP COLUMN "rentedAt",
DROP COLUMN "rentedToId";

-- CreateTable
CREATE TABLE "Rent" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "rentedAt" TIMESTAMP(3) NOT NULL,
    "rentEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Rent" ADD CONSTRAINT "Rent_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rent" ADD CONSTRAINT "Rent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
