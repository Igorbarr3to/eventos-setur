import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const pesquisaSchema = z.object({
    perfil: z.string(),
    comoSoube: z.string(),
    veioOutraCidade: z.string(),
    hospedagem: z.string(),
    gasto: z.string(),
    beneficiosEconomicos: z.string(),
    maiorImpacto: z.string(),
    organizacao: z.string(),
    acessibilidade: z.string(),
    turismo: z.string(),
    impactoAmbiental: z.string(),
    sustentabilidade: z.string(),
    visitaTuristica: z.string(),
    recomendaria: z.string(),
})

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
    try {
        const json = await request.json()
        const data = pesquisaSchema.parse(json)

        const resposta = await prisma.pesquisa.create({ data })

        return NextResponse.json(resposta)
    }
    catch(error){
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 })
        }
        console.error('Erro ao salvar pesquisa:', error)
        return NextResponse.json({ error: 'Erro ao salvar pesquisa' }, { status: 500 })
    }
}

export async function GET() {
    try {
        const pesquisas = await prisma.pesquisa.findMany()
        return NextResponse.json(pesquisas)
    } catch (error) {
        console.error('Erro ao buscar pesquisas:', error)
        return NextResponse.json({ error: 'Erro ao buscar pesquisas' }, { status: 500 })
    }
}
