// app/admin/formularios/[id]/page.tsx
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Formulario, Pergunta } from "@prisma/client";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { GerenciadorDePerguntas } from "@/components/admin/perguntas/gerenciador-perguntas";

type FormularioComPerguntas = Formulario & { perguntas: Pergunta[] };

async function getFormulario(id: string): Promise<FormularioComPerguntas | null> {
  try {
    const cookieStore = cookies();
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/public/formularios/${id}`, {
      headers: { Cookie: cookieStore.toString() },
      cache: 'no-store',
    });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Falha ao buscar formulário:", error);
    return null;
  }
}

export default async function PaginaGerenciarPerguntas({ params }: { params: { id: string } }) {
  const formulario = await getFormulario(params.id);

  if (!formulario) {
    notFound();
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/pesquisas">Pesquisas</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/pesquisas/${formulario.pesquisaId}`}>Formulários</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{formulario.nome}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      {/* O Client Component recebe os dados iniciais */}
      <GerenciadorDePerguntas formularioInicial={formulario} />
    </div>
  );
}