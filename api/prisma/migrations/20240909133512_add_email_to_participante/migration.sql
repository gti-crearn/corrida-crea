/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `participantes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `participantes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "participantes" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "participantes_email_key" ON "participantes"("email");
