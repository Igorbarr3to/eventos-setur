'use client';

import { Pesquisa } from "@prisma/client";
import { useEffect, useState } from "react";
import CriarPesquisaModal from "./criar-pesquisa-modal";
import { PesquisaCard } from "./pesquisa-card";


interface PesquisasListProps {
  pesquisasIniciais: Pesquisa[];
}

export default function PesquisasList({ pesquisasIniciais }: PesquisasListProps) {
  const [pesquisas, setPesquisas] = useState(pesquisasIniciais);
  const [isLoading, setIsLoading] = useState(false);

  const refetchPesquisas = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/pesquisas');
      const data = await response.json();
      setPesquisas(data);
    } catch (error) {
      console.error("Falha ao recarregar pesquisas", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    setPesquisas(pesquisasIniciais);
  }, [pesquisasIniciais]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciamento de Pesquisas</h1>
        <CriarPesquisaModal onPesquisaCriada={refetchPesquisas} />
      </div>

      {isLoading && <p>Atualizando lista...</p>}

      {pesquisas.length > 0 ? (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pesquisas.map(p => (
            <PesquisaCard key={p.id} pesquisa={p} onListChange={refetchPesquisas} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold">Nenhuma pesquisa encontrada</h2>
            <p className="text-muted-foreground mt-2">Clique em "Criar Nova Pesquisa" para começar.</p>
        </div>
      )}
    </div>
  );
}