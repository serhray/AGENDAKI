/*
  Warnings:

  - The values [FREE,BASIC] on the enum `SubscriptionPlan` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SubscriptionPlan_new" AS ENUM ('FREEMIUM', 'INICIAL', 'PROFESSIONAL', 'PREMIUM');
ALTER TABLE "Business" ALTER COLUMN "plan" DROP DEFAULT;
ALTER TABLE "Business" ALTER COLUMN "plan" TYPE "SubscriptionPlan_new" USING ("plan"::text::"SubscriptionPlan_new");
ALTER TYPE "SubscriptionPlan" RENAME TO "SubscriptionPlan_old";
ALTER TYPE "SubscriptionPlan_new" RENAME TO "SubscriptionPlan";
DROP TYPE "SubscriptionPlan_old";
ALTER TABLE "Business" ALTER COLUMN "plan" SET DEFAULT 'FREEMIUM';
COMMIT;

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "maxAppointmentsPerMonth" INTEGER NOT NULL DEFAULT 20,
ADD COLUMN     "maxProfessionals" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "plan" SET DEFAULT 'FREEMIUM',
ALTER COLUMN "planStatus" SET DEFAULT 'ACTIVE';
