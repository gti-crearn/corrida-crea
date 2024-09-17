/*
  Warnings:

  - You are about to drop the column `vouchId` on the `participantes` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "participantes_vouchId_key";

-- DropIndex
DROP INDEX "vouches_participanteId_key";

-- AlterTable
ALTER TABLE "participantes" DROP COLUMN "vouchId";
