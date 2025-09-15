/*
  Warnings:

  - The values [ESCALA,DATA] on the enum `TipoResposta` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TipoResposta_new" AS ENUM ('TEXTO', 'NUMERO', 'OPCAO', 'MULTIPLA', 'LOCALIDADE_MUNICIPIO');
ALTER TABLE "perguntas" ALTER COLUMN "tipo_resposta" TYPE "TipoResposta_new" USING ("tipo_resposta"::text::"TipoResposta_new");
ALTER TABLE "perguntas_templates" ALTER COLUMN "tipo_resposta" TYPE "TipoResposta_new" USING ("tipo_resposta"::text::"TipoResposta_new");
ALTER TYPE "TipoResposta" RENAME TO "TipoResposta_old";
ALTER TYPE "TipoResposta_new" RENAME TO "TipoResposta";
DROP TYPE "TipoResposta_old";
COMMIT;

-- AlterTable
ALTER TABLE "perguntas" ADD COLUMN     "incluir_opcao_outro" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "perguntas_templates" ADD COLUMN     "incluir_opcao_outro" BOOLEAN NOT NULL DEFAULT false;
