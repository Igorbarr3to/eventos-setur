-- CreateTable
CREATE TABLE "formularios_templates" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "descricao" TEXT,
    "tipo" "FormularioTipo" NOT NULL DEFAULT 'PARTICIPANTE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "formularios_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perguntas_templates" (
    "id" SERIAL NOT NULL,
    "template_id" INTEGER NOT NULL,
    "texto" TEXT NOT NULL,
    "tipo_resposta" "TipoResposta" NOT NULL,
    "opcoes_json" JSONB,
    "obrigatoria" BOOLEAN NOT NULL DEFAULT false,
    "ordem" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "perguntas_templates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "perguntas_templates" ADD CONSTRAINT "perguntas_templates_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "formularios_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
