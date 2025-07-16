'use client';

import { Formulario, Pesquisa } from "@prisma/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { FileText } from "lucide-react";
import { CriarFormularioModal } from "./criar-formulario-modal";
import { DeletarFormularioBotao } from "./deletar-formulario-modal";
import { EditarFormularioModal } from "./editar-formulario-modal";

interface FormulariosListProps {
    pesquisaId: number;
}

export function FormulariosList({ pesquisaId }: FormulariosListProps) {
    const [formularios, setFormularios] = useState<Formulario[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

    return (
        <div className="space-y-4">
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
                        <Card key={form.id} className="bg-white">
                            <CardHeader>
                                <CardTitle>{form.nome}</CardTitle>
                                <CardDescription>{form.descricao || 'Sem descrição'}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">Tipo: {form.tipo}</p>
                            </CardContent>
                            <CardFooter className="border-t gap-2">

                                {/* O link para gerenciar as perguntas será adicionado depois */}
                                <Button asChild className="border bg-blue-600/40">
                                    <Link href="#">Gerenciar Perguntas</Link>
                                </Button>

                                <EditarFormularioModal
                                    formulario={form}
                                    onFormularioEditado={refetchFormularios}
                                />
                                <DeletarFormularioBotao
                                    formularioId={form.id}
                                    onFormularioDeleted={refetchFormularios}
                                />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}