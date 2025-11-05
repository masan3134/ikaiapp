-- AlterTable: Add email verification fields to User model
ALTER TABLE "users" ADD COLUMN "emailVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN "verificationToken" TEXT;
ALTER TABLE "users" ADD COLUMN "verificationExpiry" TIMESTAMP(3);

-- CreateIndex: Add unique constraint to verificationToken
CREATE UNIQUE INDEX "users_verificationToken_key" ON "users"("verificationToken");
