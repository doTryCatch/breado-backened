-- CreateTable
CREATE TABLE "expenses" (
    "expense_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("expense_id")
);
