'use client';

import Link from "next/link";
import { Pesquisa, PesquisaStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import { DeletarPesquisaModal } from "./deletar-pesquisa-modal";
import { EditarPesquisaModal } from "./editar-pesquisa-modal";

interface PesquisaCardProps {
  pesquisa: Pesquisa;
  onListChange: () => void;
}

export function PesquisaCard({ pesquisa, onListChange }: PesquisaCardProps) {
  return (
    <Card className="bg-gray-300 flex flex-col justify-between transition transform hover:scale-105">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl mb-1">{pesquisa.titulo}</CardTitle>
          {
            pesquisa.status === 'PLANEJADO'
              ? <Badge className="bg-amber-400">Planejado</Badge>
              : pesquisa.status === 'CANCELADO'
                ? <Badge className="bg-red-400">Cancelado</Badge>
                : pesquisa.status === 'CONCLUIDO'
                  ? <Badge className="bg-green-400">Concluído</Badge>
                  : <Badge className="bg-blue-400">Em andamento</Badge>
          }
        </div>
        <CardDescription>{pesquisa.descricao || "Esta pesquisa não tem uma descrição."}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        {pesquisa.localAplicacao && (
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            <span>{pesquisa.localAplicacao}</span>
          </div>
        )}
        {pesquisa.dataInicio && (
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>
              {new Date(pesquisa.dataInicio).toLocaleDateString('pt-BR')} a {pesquisa.dataFim ? new Date(pesquisa.dataFim).toLocaleDateString('pt-BR') : ''}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between gap-2 p-4 mt-4">
        <Link href={`/pesquisas/${pesquisa.id}`}>
          <Button className="bg-gray-400 border ">
            Gerenciar
          </Button>
        </Link>
        <div className="space-x-2"> 
          <EditarPesquisaModal pesquisa={pesquisa} onPesquisaEditada={onListChange} />
          <DeletarPesquisaModal pesquisaId={pesquisa.id} onPesquisaDeleted={onListChange}/>
        </div>
      </CardFooter>
    </Card>
  );
}