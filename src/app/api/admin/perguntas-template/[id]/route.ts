// app/api/admin/perguntas/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { TipoResposta } from "@prisma/client";

const editPerguntaSchema = z.object({
  texto: z.string().min(1).optional(),
  tipoResposta: z.nativeEnum(TipoResposta).optional(),
  obrigatoria: z.boolean().optional(),
  opcoesJson: z.any().optional().nullable(),
  ordem: z.number().int().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
        return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    try {
        const perguntaId = parseInt(params.id);
        const json = await request.json();
        const data = editPerguntaSchema.parse(json);

        const updatedPergunta = await prisma.perguntaTemplate.update({
            where: { id: perguntaId },
            data: data,
        });

        return NextResponse.json(updatedPergunta);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Dados inválidos', issues: error.issues }, { status: 400 });
        }
        return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
        return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    try {
        const perguntaId = parseInt(params.id);
        await prisma.perguntaTemplate.delete({ where: { id: perguntaId } });
        return NextResponse.json({ message: 'Pergunta excluída com sucesso.' });
    } catch (error) {
        return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
    }
}