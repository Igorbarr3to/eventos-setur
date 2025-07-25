'use client';

import { Formulario } from "@prisma/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ChevronDown, ChevronUp, Share2 } from "lucide-react";
import { CriarFormularioModal } from "./criar-formulario-modal";
import { DeletarFormularioBotao } from "./deletar-formulario-modal";
import { EditarFormularioModal } from "./editar-formulario-modal";
import { PerguntasList } from "../perguntas/perguntas-list";
import { toast } from "sonner";

interface FormulariosListProps {
    pesquisaId: number;
}

export function FormulariosList({ pesquisaId }: FormulariosListProps) {
    const [formularios, setFormularios] = useState<Formulario[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    // 2. Estado para controlar qual card está expandido
    const [expandedFormId, setExpandedFormId] = useState<number | null>(null);

    const refetchFormularios = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/admin/formularios?pesquisaId=${pesquisaId}`);
            if (!response.ok) throw new Error("Falha ao buscar formulários.");
            const data = await response.json();
            setFormularios(data);
        } catch (error) {
            console.error(error);
            setFormularios([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refetchFormularios();
    }, [pesquisaId]);

    // Função para alternar a exibição da seção de perguntas
    const toggleExpand = (formId: number) => {
        setExpandedFormId(prevId => (prevId === formId ? null : formId));
    };

    return (
        <div className="space-y-4 w-full">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Formulários da Pesquisa</h2>
                <CriarFormularioModal
                    pesquisaId={pesquisaId}
                    onFormularioCriado={refetchFormularios}
                />
            </div>

            {isLoading && <p>Carregando formulários...</p>}

            {!isLoading && formularios.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-xl font-semibold">Nenhum formulário encontrado</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Clique em "Criar Novo Formulário" para começar.</p>
                </div>
            )}

            {!isLoading && formularios.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formularios.map(form => (
                        <div key={form.id}>
                            <Card className={`w-[400px] bg-white transition-all ${expandedFormId === form.id ? 'rounded-b-lg' : ''}`}>
                                <CardHeader>
                                    <CardTitle>{form.nome}</CardTitle>
                                    <CardDescription>{form.descricao || 'Sem descrição'}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex  justify-between">
                                    <p className="text-sm text-muted-foreground">Tipo: {form.tipo}</p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const url = `${window.location.origin}/responder/${form.id}`;
                                                navigator.clipboard.writeText(url);
                                                toast.success("Link público copiado para a área de transferência!");
                                            }}
                                        >
                                            <Share2 className="mr-2 h-4 w-4" />
                                            Compartilhar
                                        </Button>
                                        <EditarFormularioModal formulario={form} onFormularioEditado={refetchFormularios} />
                                        <DeletarFormularioBotao formularioId={form.id} onFormularioDeleted={refetchFormularios} />
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col justify-between items-center border-t pt-4">
                                    {/* 3. Botão para expandir/recolher */}
                                    <Button variant="ghost" onClick={() => toggleExpand(form.id)}>
                                        {expandedFormId === form.id ? <ChevronUp className="mr-2 h-4 w-4" /> : <ChevronDown className="mr-2 h-4 w-4" />}
                                        Perguntas
                                    </Button>

                                    {expandedFormId === form.id && (
                                        <div className="">
                                            <PerguntasList formularioId={form.id} />
                                        </div>
                                    )}
                                </CardFooter>
                            </Card>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}