-- CreateTable
CREATE TABLE "Pesquisa" (
    "id" SERIAL NOT NULL,
    "perfil" TEXT NOT NULL,
    "comoSoube" TEXT NOT NULL,
    "veioOutraCidade" TEXT NOT NULL,
    "hospedagem" TEXT NOT NULL,
    "gasto" TEXT NOT NULL,
    "beneficiosEconomicos" TEXT NOT NULL,
    "maiorImpacto" TEXT NOT NULL,
    "organizacao" TEXT NOT NULL,
    "acessibilidade" TEXT NOT NULL,
    "turismo" TEXT NOT NULL,
    "impactoAmbiental" TEXT NOT NULL,
    "sustentabilidade" TEXT NOT NULL,
    "visitaTuristica" TEXT NOT NULL,
    "recomendaria" TEXT NOT NULL,
    "dataHoraResposta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pesquisa_pkey" PRIMARY KEY ("id")
);
