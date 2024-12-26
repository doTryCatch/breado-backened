/*
  Warnings:

  - You are about to drop the column `status` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "status",
ADD COLUMN     "deposit" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "remaining" INTEGER NOT NULL DEFAULT 0;
