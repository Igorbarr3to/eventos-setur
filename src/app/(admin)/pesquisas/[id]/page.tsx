import { cookies } from "next/headers";
import { Pesquisa } from "@prisma/client";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { FormulariosList } from "@/components/admin/formularios/formulario-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

async function getPesquisaById(id: string): Promise<Pesquisa | null> {
  try {
    const cookieStore = cookies();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/pesquisas/${id}`,
      {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      }
    );

    if (response.status === 404) {
      return null; // Retorna nulo se a API retornar 404
    }

    if (!response.ok) {
      throw new Error("Falha ao buscar dados da pesquisa.");
    }

    return response.json();
  } catch (error) {
    console.error("Erro crítico ao buscar pesquisa:", error);
    return null; // Retorna nulo em caso de erro
  }
}

// A página recebe 'params' como prop, que contém o 'id' da URL
export default async function PaginaDetalhePesquisa({
  params,
}: {
  params: { id: string };
}) {
  const pesquisa = await getPesquisaById(params.id);

  // Se a pesquisa não for encontrada, exibe a página de 404 padrão do Next.js
  if (!pesquisa) {
    notFound();
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/pesquisas">Pesquisas</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{pesquisa.titulo}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{pesquisa.titulo}</h1>
          <p className="text-muted-foreground mt-2">{pesquisa.descricao}</p>
          <Link href={`/pesquisas/${pesquisa.id}/resultados`}>
            <Button>Ver Resultados</Button>
          </Link>
        </div>
        <Badge variant="secondary" className="text-sm">
          {pesquisa.status}
        </Badge>
      </div>

      {/* Seção de Detalhes do Projeto */}
      {pesquisa.tipo === "EVENTO" && (
        <div className="space-y-4 p-6 border rounded-lg bg-slate-50">
          <h2 className="text-xl font-semibold border-b pb-2">
            Detalhes do Projeto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div>
              <strong>Título do Projeto:</strong>{" "}
              {pesquisa.tituloProjeto || "N/A"}
            </div>
            <div>
              <strong>Proponente:</strong> {pesquisa.proponente || "N/A"}
            </div>
            <div>
              <strong>Município:</strong> {pesquisa.municipio || "N/A"}
            </div>
            <div>
              <strong>Local:</strong> {pesquisa.localAplicacao || "N/A"}
            </div>
            <div>
              <strong>Início:</strong>{" "}
              {new Date(pesquisa.dataInicio!).toLocaleDateString("pt-BR")}
            </div>
            <div>
              <strong>Fim:</strong>{" "}
              {new Date(pesquisa.dataFim!).toLocaleDateString("pt-BR")}
            </div>
            <div className="col-span-2">
              <strong>Objetivo Geral:</strong> {pesquisa.objetivoGeral || "N/A"}
            </div>
          </div>
        </div>
      )}

      {/* --- Seção de Gerenciamento de Formulários --- */}
      <div className="space-y-4 pt-8 border-t">
        <div className="flex justify-between items-center">
          <FormulariosList pesquisaId={pesquisa.id} />
        </div>
      </div>
    </div>
  );
}
