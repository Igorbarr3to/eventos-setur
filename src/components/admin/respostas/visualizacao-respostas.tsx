"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PerguntaInfo {
  texto: string;
  tipoResposta: string;
}
interface DetalheResposta {
  valorTexto: string | null;
  valorNumero: number | null;
  valorOpcao: string | null;
  pergunta: PerguntaInfo;
}
interface RespostaCompleta {
  id: number;
  dataResposta: string;
  detalhes: DetalheResposta[];
}

interface VisualizacaoDeRespostasProps {
  respostasIniciais: RespostaCompleta[];
}

export default function VisualizacaoDeRespostas({
  respostasIniciais,
}: VisualizacaoDeRespostasProps) {
  //useMemo para processar os dados apenas uma vez
  const dadosAgregados = useMemo(() => {
    if (!respostasIniciais || respostasIniciais.length === 0) {
      return [];
    }

    const agregador: { [perguntaTexto: string]: any } = {};

    // Agrupar todas as respostas por pergunta
    respostasIniciais.forEach((resposta) => {
      resposta.detalhes.forEach((detalhe) => {
        const { pergunta, valorTexto, valorNumero, valorOpcao } = detalhe;
        if (!agregador[pergunta.texto]) {
          agregador[pergunta.texto] = {
            tipo: pergunta.tipoResposta,
            respostas: [],
          };
        }
        const valor = valorTexto ?? valorNumero ?? valorOpcao;
        if (valor !== null) {
          agregador[pergunta.texto].respostas.push(valor);
        }
      });
    });

    // Processar os dados agregados para visualização
    return Object.entries(agregador).map(([perguntaTexto, dados]) => {
      if (dados.tipo === "OPCAO" || dados.tipo === "MULTIPLA") {
        const contagem = dados.respostas.reduce((acc: any, val: string) => {
          const opcoes = val.split(", ");
          opcoes.forEach((opt) => {
            acc[opt] = (acc[opt] || 0) + 1;
          });
          return acc;
        }, {});
        // Retorna um objeto com tipo 'grafico' e a propriedade 'data'
        return {
          pergunta: perguntaTexto,
          tipo: "grafico",
          data: Object.entries(contagem).map(([name, value]) => ({
            name,
            contagem: value,
          })),
        };
      } else if (dados.tipo === "ESCALA" || dados.tipo === "NUMERO") {
        const numeros = dados.respostas.filter(
          (n: any) => typeof n === "number"
        );
        const media =
          numeros.reduce((a: number, b: number) => a + b, 0) /
          (numeros.length || 1);

        return {
          pergunta: perguntaTexto,
          tipo: "estatistica",
          data: { titulo: "Média", valor: media.toFixed(2) },
        };
      } else {
        // TEXTO
        return {
          pergunta: perguntaTexto,
          tipo: "texto",
          data: dados.respostas,
        };
      }
    });
  }, [respostasIniciais]);

  const totalRespostas = respostasIniciais.length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Resultados da Pesquisa</h1>

      <Card>
        <CardHeader>
          <CardTitle>Total de Respostas Recebidas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{totalRespostas}</p>
        </CardContent>
      </Card>

      {dadosAgregados.map((item, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{item.pergunta}</CardTitle>
          </CardHeader>
          <CardContent>
            {item.tipo === "grafico" && (
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={item.data}
                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="contagem" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            {item.tipo === "estatistica" && (
              // Acessamos os dados dentro da propriedade 'data'
              <p className="text-3xl font-bold">
                {item.data.valor}{" "}
                <span className="text-lg text-muted-foreground">
                  ({item.data.titulo})
                </span>
              </p>
            )}
            {item.tipo === "texto" && (
              <ScrollArea className="h-48 w-full rounded-md border p-4">
                <ul className="space-y-2">
                  {/* O acesso a 'item.data' agora é seguro */}
                  {item.data.map((texto: string, i: number) => (
                    <li key={i} className="text-sm border-b pb-1">
                      "{texto}"
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
