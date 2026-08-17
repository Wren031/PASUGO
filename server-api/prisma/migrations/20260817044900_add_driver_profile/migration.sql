/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `driver_profiles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[license_number]` on the table `driver_profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "driver_profiles" ADD COLUMN     "address" TEXT,
ADD COLUMN     "average_rating" DECIMAL(3,2),
ADD COLUMN     "cancelled_rides" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "completed_rides" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "date_of_birth" TIMESTAMP(3),
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "is_available" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_online" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "license_expiry" TIMESTAMP(3),
ADD COLUMN     "license_number" TEXT,
ADD COLUMN     "middle_name" TEXT,
ADD COLUMN     "phone_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "profile_photo" TEXT,
ADD COLUMN     "province" TEXT,
ADD COLUMN     "total_rides" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "driver_profiles_phone_key" ON "driver_profiles"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "driver_profiles_license_number_key" ON "driver_profiles"("license_number");
