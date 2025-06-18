-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'viewer', 'editor');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'viewer';
