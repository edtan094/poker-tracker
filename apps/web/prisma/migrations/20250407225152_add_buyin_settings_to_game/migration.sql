-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "chipsPerBuyIn" INTEGER NOT NULL DEFAULT 500,
ADD COLUMN     "dateOfGame" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dollarPerBuyIn" DOUBLE PRECISION NOT NULL DEFAULT 5,
ADD COLUMN     "updatedAt" TIMESTAMP(3);
