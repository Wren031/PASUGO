-- CreateEnum
CREATE TYPE "DriverVerificationDocumentType" AS ENUM ('DRIVER_LICENSE_FRONT', 'DRIVER_LICENSE_BACK', 'OR', 'CR', 'NBI_CLEARANCE', 'POLICE_CLEARANCE');

-- CreateEnum
CREATE TYPE "DriverVerificationStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- CreateTable
CREATE TABLE "driver_verifications" (
    "id" TEXT NOT NULL,
    "driver_profile_id" TEXT NOT NULL,
    "document_type" "DriverVerificationDocumentType" NOT NULL,
    "file_path" TEXT NOT NULL,
    "status" "DriverVerificationStatus" NOT NULL DEFAULT 'Pending',
    "rejection_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "driver_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "driver_verifications_driver_profile_id_idx" ON "driver_verifications"("driver_profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "driver_verifications_driver_profile_id_document_type_key" ON "driver_verifications"("driver_profile_id", "document_type");

-- AddForeignKey
ALTER TABLE "driver_verifications" ADD CONSTRAINT "driver_verifications_driver_profile_id_fkey" FOREIGN KEY ("driver_profile_id") REFERENCES "driver_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
