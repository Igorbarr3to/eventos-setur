// app/api/respostas/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { TipoResposta } from '../../../../types/types'; 

// Zod Schema para validar os detalhes de uma resposta individual
const respostaDetalheSchema = z.object({
    perguntaId: z.number().int(),
    valorTexto: z.string().optional().nullable(),
    valorNumero: z.number().optional().nullable(),
    valorData: z.string().datetime().optional().nullable(), // Espera ISO string
    valorOpcao: z.string().optional().nullable(), // Para radio ou múltiplos como string
});

// Zod Schema para a submissão completa do formulário
const frontendSubmissionDataSchema = z.object({
    formularioId: z.number().int(),
    pesquisaId: z.number().int(),
    respostasDetalhes: z.array(respostaDetalheSchema),
    // ip e userAgent serão coletados no backend, não vêm do frontend
});

export async function POST(request: NextRequest) {
    try {
        const json = await request.json();
        const data = frontendSubmissionDataSchema.parse(json); // Valida a entrada do frontend

        // Coletar IP e User-Agent do request
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
        const userAgent = request.headers.get('user-agent') || null;

        // 1. Criar o registro de cabeçalho da Resposta
        const novaResposta = await prisma.resposta.create({
            data: {
                formularioId: data.formularioId,
                pesquisaId: data.pesquisaId,
                ip: ip,
                userAgent: userAgent,
            },
        });

        // 2. Preparar e criar os detalhes da resposta
        const detalhesParaCriar = await Promise.all(
            data.respostasDetalhes.map(async (detail) => {
                const pergunta = await prisma.pergunta.findUnique({
                    where: { id: detail.perguntaId },
                    select: { tipoResposta: true }
                });

                if (!pergunta) {
                    // Se a pergunta não for encontrada, é um erro grave ou dados inválidos
                    throw new Error(`Pergunta com ID ${detail.perguntaId} não encontrada no banco de dados.`);
                }

                const detalheData: any = {
                    respostaId: novaResposta.id,
                    perguntaId: detail.perguntaId,
                };

                // Mapear o valor para a coluna correta com base no tipoResposta da Pergunta
                // O `null` é importante para campos opcionais no Prisma
                switch (pergunta.tipoResposta) {
                    case TipoResposta.TEXTO:
                        detalheData.valorTexto = detail.valorTexto || null;
                        break;
                    case TipoResposta.NUMERO:
                        detalheData.valorNumero = detail.valorNumero || null;
                        break;
                    case TipoResposta.DATA:
                        detalheData.valorData = detail.valorData ? new Date(detail.valorData) : null;
                        break;
                    case TipoResposta.OPCAO:
                    case TipoResposta.ESCALA:
                    case TipoResposta.MULTIPLA:
                        detalheData.valorOpcao = detail.valorOpcao || null;
                        break;
                    default:
                        // Lidar com tipos de resposta desconhecidos ou não esperados
                        console.warn(`Tipo de resposta desconhecido para pergunta: ${pergunta.tipoResposta}`);
                        break;
                }
                return detalheData;
            })
        );

        // Criar todos os detalhes de uma vez para melhor performance
        await prisma.respostaDetalhe.createMany({
            data: detalhesParaCriar,
        });

        return NextResponse.json({ message: 'Pesquisa enviada com sucesso!', respostaId: novaResposta.id }, { status: 201 }); // 201 Created

    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Erro de validação Zod ao submeter resposta:', error.errors);
            return NextResponse.json({ errors: error.errors }, { status: 400 });
        }
        console.error('Erro ao salvar resposta:', error);
        return NextResponse.json({ message: 'Erro ao salvar resposta' }, { status: 500 });
    }
}