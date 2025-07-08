/*
  Warnings:

  - Added the required column `eventoId` to the `Pesquisa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pesquisa" ADD COLUMN     "eventoId" INTEGER NOT NULL,
ALTER COLUMN "hospedagem" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Evento" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pesquisa" ADD CONSTRAINT "Pesquisa_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
