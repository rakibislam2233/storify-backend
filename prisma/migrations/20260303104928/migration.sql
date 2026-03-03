-- AlterTable
ALTER TABLE "packages" ADD COLUMN     "price" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "subscription_histories" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "packageName" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),

    CONSTRAINT "subscription_histories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "subscription_histories" ADD CONSTRAINT "subscription_histories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
