"use client";

import { FormularioTemplate } from "@prisma/client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { CriarTemplateModal } from "./criar-template-modal";
import { DeletarTemplateBotao } from "./deletar-template-modal";
import { EditarTemplateModal } from "./editar-template-modal";

export default function TemplatesList({
  templatesIniciais,
}: {
  templatesIniciais: FormularioTemplate[];
}) {
  const [templates, setTemplates] = useState(templatesIniciais || []);

  const refetchTemplates = async () => {
    try {
      const response = await fetch("/api/admin/templates");
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error("Falha ao recarregar templates", error);
    }
  };
  useEffect(() => {
    setTemplates(templatesIniciais || []);
  }, [templatesIniciais]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Modelos de Formulários</h1>
        <CriarTemplateModal onTemplateCriado={refetchTemplates} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="bg-gray-100 flex flex-col justify-between border-none shadow-xl-t shadow-black transition transform hover:scale-105">
            <CardHeader>
              <CardTitle>{template.nome}</CardTitle>
              <CardDescription>
                {template.descricao || "Sem descrição"}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between gap-2">
              <Link href={`/templates/${template.id}`}>
                <Button className="bg-zinc-400/60 border border-zinc-500 transition transform hover:cursor-pointer hover:scale-110">
                  Gerenciar
                </Button>
              </Link>
              <div className="space-x-2">
                <DeletarTemplateBotao
                  templateId={template.id}
                  onTemplateDeleted={refetchTemplates}
                />
                <EditarTemplateModal
                  template={template}
                  onTemplateEditado={refetchTemplates}
                />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
