/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `passenger_profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Other', 'PreferNotToSay');

-- AlterTable
ALTER TABLE "passenger_profiles" ADD COLUMN     "address" TEXT,
ADD COLUMN     "average_rating" DECIMAL(3,2),
ADD COLUMN     "cancelled_rides" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "date_of_birth" TIMESTAMP(3),
ADD COLUMN     "emergency_name" TEXT,
ADD COLUMN     "emergency_phone" TEXT,
ADD COLUMN     "emergency_relation" TEXT,
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "middle_name" TEXT,
ADD COLUMN     "phone_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "profile_photo" TEXT,
ADD COLUMN     "province" TEXT,
ADD COLUMN     "total_rides" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "passenger_profiles_phone_key" ON "passenger_profiles"("phone");
