import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma"; // 👈 1. Importe o Prisma
import VisualizacaoDeRespostas from "@/components/admin/respostas/visualizacao-respostas";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Pesquisa } from "@prisma/client";

// 2. Simplifique a interface de props da página
interface PageProps {
  params: { id: string };
}

// 3. Modifique as funções para usar o Prisma diretamente
async function getRespostas(pesquisaId: string) {
  try {

    return await prisma.resposta.findMany({
      where: { pesquisaId },
      include: {
        detalhes: {
          include: {
            pergunta: { select: { texto: true, tipoResposta: true } },
          },
        },
      },
      orderBy: { dataResposta: 'desc' },
    });
  } catch (error) {
    console.error("Erro ao buscar respostas diretamente:", error);
    return [];
  }
}

async function getPesquisa(pesquisaId: string): Promise<Pesquisa | null> {
  try {
    return await prisma.pesquisa.findUnique({
      where: { id: pesquisaId },
    });
  } catch (error) {
    console.error("Erro ao buscar detalhes da pesquisa:", error);
    return null;
  }
}

// 4. Corrija a assinatura e a lógica da página
export default async function PaginaResultados({ params }: PageProps) {
  const { id } = params; // O ID já é uma string, sem 'await'

  const [pesquisa, respostas] = await Promise.all([
    getPesquisa(id),
    getRespostas(id),
  ]);

  if (!pesquisa) {
    notFound();
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/pesquisas">Pesquisas</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/admin/pesquisas/${pesquisa.id}`}>
              {pesquisa.titulo}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Resultados</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      {/* Passe o título também para o componente de visualização */}
      <VisualizacaoDeRespostas
        respostasIniciais={respostas}
      />
    </div>
  );
}