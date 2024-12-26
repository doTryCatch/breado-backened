/*
  Warnings:

  - You are about to drop the column `created_at` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `seller_orders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "seller_orders" DROP CONSTRAINT "seller_orders_seller_id_fkey";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "created_at",
ADD COLUMN     "cleated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "seller_orders";
