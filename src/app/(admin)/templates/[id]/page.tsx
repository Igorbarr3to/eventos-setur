// app/admin/templates/[id]/page.tsx
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { FormularioTemplate, PerguntaTemplate } from "@prisma/client";
import { GerenciadorDePerguntasTemplate } from "@/components/admin/templates/gerenciador-de-perguntas";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export type PageProps = Promise<{id: string}>
// Tipo para incluir as perguntas
type TemplateComPerguntas = FormularioTemplate & { perguntas: PerguntaTemplate[] };

// Função para buscar o template e suas perguntas no servidor
async function getTemplate(id: string): Promise<TemplateComPerguntas | null> {
  try {
    const cookieStore = await cookies();
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/templates/${id}`, {
      headers: { Cookie: cookieStore.toString() },
      cache: 'no-store',
    });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Falha ao buscar template:", error);
    return null;
  }
}

export default async function PaginaGerenciarTemplate(props: { params: PageProps }) {
 const { id } = await props.params;
  const template = await getTemplate(id);

  if (!template) {
    notFound();
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/templates">
              Modelos
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{template.nome}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div>
        <h1 className="text-3xl font-bold">{template.nome}</h1>
        <p className="text-muted-foreground">{template.descricao}</p>
      </div>
      
      {/* O Client Component recebe os dados iniciais */}
      <GerenciadorDePerguntasTemplate templateInicial={template} />
    </div>
  );
}