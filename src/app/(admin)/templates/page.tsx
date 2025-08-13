// app/admin/templates/page.tsx
import { cookies } from "next/headers";
import TemplatesList from "@/components/admin/templates/templates-list";

async function getTemplates() {
  try {
    const cookieStore = await cookies();
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/templates`, {
      headers: { Cookie: cookieStore.toString() },
      cache: 'no-store',
    });
    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error("Falha ao buscar templates:", error);
    return [];
  }
}

export default async function PaginaTemplates() {
  const templatesIniciais = await getTemplates();
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <TemplatesList templatesIniciais={templatesIniciais} />
    </div>
  );
}