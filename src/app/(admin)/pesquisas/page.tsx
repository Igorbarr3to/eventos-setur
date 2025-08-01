import PesquisasList from "@/components/admin/pesquisas/pesquisa-lista";
import { Pesquisa } from "@prisma/client";
import { cookies } from "next/headers";

async function getPesquisas(): Promise<Pesquisa[]> {
  try {
    const cookieStore = await cookies();
    // Use a variável de ambiente para a URL base da aplicação
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/pesquisas`, {
      headers: {
        // Passa o cookie de sessão para a API para autenticação
        Cookie: cookieStore.toString(),
      },
      cache: 'no-store', 
    });

    if (!response.ok) {
      console.error(`Falha ao buscar pesquisas. Status: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];

  } catch (error) {
    console.error("Erro crítico ao buscar pesquisas:", error);
    return [];
  }
}

// A página é um Server Component assíncrono
export default async function PaginaPesquisas() {
  
  // Chama a função de busca no servidor e aguarda os dados
  const pesquisasIniciais = await getPesquisas();

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* Renderiza o Client Component, passando os dados como prop */}
      <PesquisasList pesquisasIniciais={pesquisasIniciais} />
    </div>
  );
}