import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authOptions } from '../../auth/[...nextauth]/route';

// Zod Schema para criar/validar uma nova Pesquisa (Evento/Projeto)
const createPesquisaSchema = z.object({
    titulo: z.string().min(1, 'Título é obrigatório.'),
    tipo: z.enum(['EVENTO', 'GERAL']).default('EVENTO'),
    descricao: z.string().optional(),
    localAplicacao: z.string().optional(),
    tituloProjeto: z.string().optional(),
    objetivoGeral: z.string().optional(),
    objetivosEspecificos: z.string().optional(),
    justificativa: z.string().optional(),
    publicoAlvo: z.string().optional(),
    metodologia: z.string().optional(),
    produtosEsperados: z.string().optional(),
    proponente: z.string().optional(),
    cnpjProponente: z.string().optional(),
    municipio: z.string().optional(),
    areaAbrangencia: z.string().optional(),
    processoSei: z.string().optional(),
    valorTotal: z.number().optional(),
    fonteRecurso: z.string().optional(),
    elementoDespesa: z.string().optional(),
    dataInicio: z.string().datetime().optional(), // Espera string no formato ISO para data/hora
    dataFim: z.string().datetime().optional(),     // Espera string no formato ISO para data/hora
    status: z.enum(['PLANEJADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO']).default('PLANEJADO'),
    createdBy: z.number().optional(), // Se você tiver autenticação de usuário
});

// Endpoint para criar uma nova Pesquisa (Evento/Projeto)
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'ADMIN') {
        return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    try {
        const json = await request.json();
        const data = createPesquisaSchema.parse(json);

        // Ajustar campos de data para o tipo Date se existirem
        const prismaData: any = { ...data };
        if (prismaData.dataInicio) prismaData.dataInicio = new Date(prismaData.dataInicio);
        if (prismaData.dataFim) prismaData.dataFim = new Date(prismaData.dataFim);

        const novaPesquisa = await prisma.pesquisa.create({ data: prismaData });

        return NextResponse.json(novaPesquisa, { status: 201 }); // 201 Created
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Erro de validação Zod ao criar pesquisa:', error.errors);
            return NextResponse.json({ errors: error.errors }, { status: 400 });
        }
        console.error('Erro ao criar pesquisa:', error);
        return NextResponse.json({ message: 'Erro ao criar pesquisa' }, { status: 500 });
    }
}

// Endpoint para listar Pesquisas (Eventos/Projetos)
export async function GET() {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'ADMIN') {
        return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    try {
        const pesquisas = await prisma.pesquisa.findMany({
            orderBy: {
                createdAt: 'desc' // Ordenar pelas mais recentes
            },
            select: { // Seleciona apenas os campos que geralmente precisa na listagem
                id: true,
                titulo: true,
                tipo: true,
                localAplicacao: true,
                dataInicio: true,
                dataFim: true,
                status: true,
                descricao: true, // Inclui descrição para cards na UI
                // pode-se incluir outros campos que queira exibir na listagem de eventos
            }
        });
        return NextResponse.json(pesquisas);
    } catch (error) {
        console.error('Erro ao buscar pesquisas:', error);
        return NextResponse.json({ message: 'Erro ao buscar pesquisas' }, { status: 500 });
    }
}