import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PesquisaStatus, PesquisaTipo } from '@prisma/client';

// Zod Schema com as melhorias aplicadas
const createPesquisaSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório.'),
  tipo: z.nativeEnum(PesquisaTipo).default(PesquisaTipo.EVENTO),
  descricao: z.string().optional().nullable(),
  localAplicacao: z.string().optional().nullable(),
  tituloProjeto: z.string().optional().nullable(),
  objetivoGeral: z.string().optional().nullable(),
  objetivosEspecificos: z.string().optional().nullable(),
  justificativa: z.string().optional().nullable(),
  publicoAlvo: z.string().optional().nullable(),
  metodologia: z.string().optional().nullable(),
  produtosEsperados: z.string().optional().nullable(),
  proponente: z.string().optional().nullable(),
  cnpjProponente: z.string().optional().nullable(),
  municipio: z.string().optional().nullable(),
  areaAbrangencia: z.string().optional().nullable(),
  processoSei: z.string().optional().nullable(),
  valorTotal: z.number().optional().nullable(),
  fonteRecurso: z.string().optional().nullable(),
  elementoDespesa: z.string().optional().nullable(),
  dataInicio: z.coerce.date().optional().nullable(),
  dataFim: z.coerce.date().optional().nullable(),
  status: z.nativeEnum(PesquisaStatus).default('PLANEJADO'),
});


// Endpoint para criar uma nova Pesquisa
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  try {
    const json = await request.json();
    const data = createPesquisaSchema.parse(json);

    const novaPesquisa = await prisma.pesquisa.create({
      data: {
        ...data,
        createdBy: session.user.id,
      }
    });

    return NextResponse.json(novaPesquisa, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Erro de validação Zod:', error.issues);
      return NextResponse.json({ message: "Dados de entrada inválidos", issues: error.issues }, { status: 400 });
    }
    console.error('Erro ao criar pesquisa:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}

// Endpoint para listar Pesquisas
export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  try {
    const pesquisas = await prisma.pesquisa.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        titulo: true,
        tipo: true,
        localAplicacao: true,
        dataInicio: true,
        dataFim: true,
        status: true,
        descricao: true,
      }
    });
    return NextResponse.json(pesquisas);
  } catch (error) {
    console.error('Erro ao buscar pesquisas:', error);
    return NextResponse.json({ message: 'Erro ao buscar pesquisas' }, { status: 500 });
  }
}