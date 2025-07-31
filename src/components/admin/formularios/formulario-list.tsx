"use client";

import { Formulario } from "@prisma/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Share2 } from "lucide-react";
import { CriarFormularioModal } from "./criar-formulario-modal";
import { DeletarFormularioBotao } from "./deletar-formulario-modal";
import { EditarFormularioModal } from "./editar-formulario-modal";
import { toast } from "sonner";
import { AplicarTemplateModal } from "./aplicar-template-modal";
import Link from "next/link";

interface FormulariosListProps {
  pesquisaId: number;
}

export function FormulariosList({ pesquisaId }: FormulariosListProps) {
  const [formularios, setFormularios] = useState<Formulario[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refetchFormularios = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/admin/formularios?pesquisaId=${pesquisaId}`
      );
      if (!response.ok) throw new Error("Falha ao buscar formulários.");
      const data = await response.json();
      setFormularios(data);
    } catch (error) {
      toast.error("erro ao carregar formulários: " + (error as Error).message);
      setFormularios([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetchFormularios();
  }, [pesquisaId]);

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-2xl font-semibold">Formulários da Pesquisa</h2>
        <div className="space-y-2 sm:space-x-4">
          <AplicarTemplateModal
            pesquisaId={pesquisaId}
            onFormularioCriado={refetchFormularios}
          />
          <CriarFormularioModal
            pesquisaId={pesquisaId}
            onFormularioCriado={refetchFormularios}
          />
        </div>
      </div>

      {isLoading && <p>Carregando formulários...</p>}

      {!isLoading && formularios.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-xl font-semibold">
            Nenhum formulário encontrado
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Clique em "Criar Novo Formulário" para começar.
          </p>
        </div>
      )}

      {!isLoading && formularios.length > 0 && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-14">
          {formularios.map((form) => (
            <div key={form.id}>
              <Card className="bg-gray-100 flex flex-col justify-between border-none shadow-xl-t shadow-black">
                <CardHeader>
                  <CardTitle className="flex  justify-between">
                    {form.nome}
                    <p className="text-sm text-muted-foreground">
                      Tipo: {form.tipo}
                    </p>
                  </CardTitle>
                  <CardDescription>
                    {form.descricao || "Sem descrição"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <Button
                    asChild
                    className="bg-zinc-400/60 border border-zinc-500 transition transform hover:cursor-pointer hover:scale-110 "
                  >
                    <Link href={`/formularios/${form.id}`}>
                      Gerenciar Perguntas
                    </Link>
                  </Button>

                  <div className="flex justify-between items-center w-full">
                    <Button
                      variant={"outline"}
                      className="transition transform hover:cursor-pointer hover:scale-110"
                      size="sm"
                      onClick={() => {
                        const url = `${window.location.origin}/responder/${form.id}`;
                        navigator.clipboard.writeText(url);
                        toast.success(
                          "Link público copiado para a área de transferência!"
                        );
                      }}
                    >
                      <Share2 />
                      Compartilhar
                    </Button>
                    <div className="flex gap-2">
                      <EditarFormularioModal
                        formulario={form}
                        onFormularioEditado={refetchFormularios}
                      />
                      <DeletarFormularioBotao
                        formularioId={form.id}
                        onFormularioDeleted={refetchFormularios}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
