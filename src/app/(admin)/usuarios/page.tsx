import UsuariosList from "@/components/admin/usuarios/usuarios-list";
import { User } from "@prisma/client";
import { cookies } from "next/headers";

async function getUsers(): Promise<User[]> {
  try {
    const cookieStore = await cookies();

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/usuarios`, {
      headers: { Cookie: cookieStore.toString() },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`Falha ao buscar usuários. Status: ${response.status}`);
      return [];
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Erro crítico ao buscar usuários:", error);
    return [];
  }
}

// A página é um Server Component que passa os dados para o Client Component
export default async function PaginaUsuarios() {
  const usuariosIniciais = await getUsers();

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* O Server Component renderiza o Client Component com os dados iniciais */}
      <UsuariosList usuariosIniciais={usuariosIniciais} />
    </div>
  );
}