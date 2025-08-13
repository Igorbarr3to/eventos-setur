// app/api/admin/respostas/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const getRespostasSchema = z.object({
  pesquisaId: z.coerce.number().int().positive().optional(),
  formularioId: z.coerce.number().int().positive().optional(),
});

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);

    const pesquisaIdParam = searchParams.get('pesquisaId');
    const formularioIdParam = searchParams.get('formularioId');

    // Crie um objeto apenas com os parâmetros que existem na URL
    const paramsToValidate: { pesquisaId?: string; formularioId?: string } = {};
    if (pesquisaIdParam) {
      paramsToValidate.pesquisaId = pesquisaIdParam;
    }
    if (formularioIdParam) {
      paramsToValidate.formularioId = formularioIdParam;
    }

    // Valida o novo objeto
    const parsedParams = getRespostasSchema.safeParse(paramsToValidate);

    if (!parsedParams.success) {
      return NextResponse.json({ message: "Parâmetros de busca inválidos.", issues: parsedParams.error.errors }, { status: 400 });
    }

    const { pesquisaId, formularioId } = parsedParams.data;

    if (!pesquisaId && !formularioId) {
        return NextResponse.json({ message: "É necessário fornecer 'pesquisaId' ou 'formularioId'." }, { status: 400 });
    }

    const whereClause: any = {};
    if (pesquisaId) whereClause.pesquisaId = pesquisaId;
    if (formularioId) whereClause.formularioId = formularioId;

    const respostas = await prisma.resposta.findMany({
      where: whereClause,
      orderBy: { dataResposta: 'desc' },
      include: {
        detalhes: {
          include: {
            pergunta: {
              select: { texto: true, tipoResposta: true },
            },
          },
        },
        formulario: {
            select: { nome: true }
        }
      },
    });

    return NextResponse.json(respostas);

  } catch (error) {
    console.error("Erro ao buscar respostas:", error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}