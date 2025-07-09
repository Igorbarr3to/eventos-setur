import { TipoResposta } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';


// Esquema Zod para validar os dados ao criar uma nova Pergunta
const createPerguntaSchema = z.object({
    formularioId: z.number().int('ID do formulário deve ser um número inteiro.').min(1, 'ID do formulário é obrigatório.'),
    texto: z.string().min(1, 'O texto da pergunta é obrigatório.'),
    tipoResposta: z.nativeEnum(TipoResposta), // Usa o enum nativo do Prisma
    opcoesJson: z.array(z.string()).optional().nullable(),
    obrigatoria: z.boolean().default(false),
    ordem: z.number().int().optional().nullable(), // Ordem da pergunta no formulário
});

// Handler para criar uma nova definição de Pergunta
export async function POST(request: NextRequest) {
    // TODO: Adicionar lógica de autenticação/autorização de administrador aqui!
    try {
        const json = await request.json();
        const data = createPerguntaSchema.parse(json);

        //Verificar se o formularioId existe
        const formularioExists = await prisma.formulario.findUnique({ where: { id: data.formularioId } });
        if (!formularioExists) {
            return NextResponse.json({ message: 'Formulário com o ID fornecido não encontrado.' }, { status: 404 });
        }

        const novaPergunta = await prisma.pergunta.create({
            data: {
                formularioId: data.formularioId,
                texto: data.texto,
                tipoResposta: data.tipoResposta,
                opcoesJson: data.opcoesJson as any,
                obrigatoria: data.obrigatoria,
                ordem: data.ordem,
            },
        });

        return NextResponse.json(novaPergunta, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Erro de validação Zod ao criar Pergunta:', error.errors);
            return NextResponse.json({ errors: error.errors, message: 'Dados de entrada inválidos.' }, { status: 400 });
        }
        console.error('Erro ao criar Pergunta:', error);
        return NextResponse.json({ message: 'Erro interno do servidor ao criar Pergunta.' }, { status: 500 });
    }
}

// Handler para listar Perguntas
export async function GET(request: NextRequest) {
    // TODO: Adicionar lógica de autenticação/autorização de administrador aqui!
    const { searchParams } = new URL(request.url);
    const formularioId = searchParams.get('formularioId');

    try {
        const perguntas = await prisma.pergunta.findMany({
            where: formularioId ? { formularioId: parseInt(formularioId) } : {},
            orderBy: { ordem: 'asc' }, // Ordenar pela ordem definida
            select: {
                id: true,
                texto: true,
                tipoResposta: true,
                opcoesJson: true,
                obrigatoria: true,
                ordem: true,
                formularioId: true,
            }
        });
        return NextResponse.json(perguntas);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ errors: error.errors, message: 'Dados de entrada inválidos.' }, { status: 400 });
        }
        console.error('Erro ao buscar Perguntas:', error);
        return NextResponse.json({ message: 'Erro ao buscar Perguntas.' }, { status: 500 });
    }
}