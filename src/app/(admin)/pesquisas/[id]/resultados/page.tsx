// app/admin/pesquisas/[id]/resultados/page.tsx

import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import VisualizacaoDeRespostas from "@/components/admin/respostas/visualizacao-respostas";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Pesquisa } from "@prisma/client";


interface PerguntaInfo {
  texto: string;
  tipoResposta: string;
}

interface DetalheResposta {
  valorTexto: string | null;
  valorNumero: number | null;
  valorOpcao: string | null;
  pergunta: PerguntaInfo;
}

interface RespostaCompleta {
  id: number;
  dataResposta: string;
  detalhes: DetalheResposta[];
}

// Função para buscar os dados no servidor
async function getRespostas(pesquisaId: string): Promise<RespostaCompleta[]> {
  try {
    const cookieStore = cookies();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/respostas?pesquisaId=${pesquisaId}`,
      {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("Falha ao buscar respostas:", response.status);
      return [];
    }
    return response.json();
  } catch (error) {
    console.error("Erro crítico ao buscar respostas:", error);
    return [];
  }
}

async function getPesquisa(pesquisaId: string): Promise<Pesquisa | null> {
  try {
    const cookieStore = cookies();
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/pesquisas/${pesquisaId}`, {
      headers: { Cookie: cookieStore.toString() },
      cache: 'no-store',
    });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Falha ao buscar detalhes da pesquisa:", error);
    return null;
  }
}


// A página em si
export default async function PaginaResultados({params }: {params: { id: string } }) {
   const [pesquisa, respostas] = await Promise.all([
    getPesquisa(params.id),
    getRespostas(params.id)
  ]);

  if (!params.id) {
    notFound();
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
     <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/pesquisas">Pesquisas</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {/* Link para voltar para a página de gerenciamento da pesquisa */}
            <BreadcrumbLink href={`/pesquisas/${pesquisa?.id}`}>
              {pesquisa?.titulo}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Resultados</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
  
      <VisualizacaoDeRespostas respostasIniciais={respostas} />
    </div>
  );
}
