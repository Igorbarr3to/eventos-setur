"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

// Tipos de dados esperados da API
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
  id: string;
  dataResposta: string;
  detalhes: DetalheResposta[];
}
interface VisualizacaoDeRespostasProps {
  respostasIniciais: RespostaCompleta[];
}

// Cores para o gráfico de pizza
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#ff4d4d",
  "#AF19FF",
];

export default function VisualizacaoDeRespostas({
  respostasIniciais,
}: VisualizacaoDeRespostasProps) {
  const dadosAgregados = useMemo(() => {
    if (!respostasIniciais || respostasIniciais.length === 0) {
      return [];
    }

    const agregador: { [perguntaTexto: string]: any } = {};

    // Agrupa todas as respostas por pergunta
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

    // Processa os dados agregados para o formato de visualização correto
    return Object.entries(agregador).map(([perguntaTexto, dados]) => {
      if (dados.tipo === "OPCAO" || dados.tipo === "MULTIPLA") {
        const contagem = dados.respostas.reduce(
          (acc: { [key: string]: number }, val: string) => {
            const opcoes = val.split(", ");
            opcoes.forEach((opt) => {
              acc[opt] = (acc[opt] || 0) + 1;
            });
            return acc;
          },
          {}
        );

        const dataForChart = Object.entries(contagem).map(([name, value]) => ({
          name,
          value,
        }));

        const isBinaryChoice =
          dataForChart.length <= 3 &&
          dataForChart.some((d) =>
            ["sim", "não", "nao"].includes(d.name.toLowerCase())
          );
        const tipoGrafico =
          dataForChart.length >= 4 || !isBinaryChoice
            ? "grafico_pizza"
            : "grafico_barra";

        return {
          pergunta: perguntaTexto,
          tipo: tipoGrafico,
          data: dataForChart,
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

      <Card className="border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            Total de Respostas Recebidas
            <p className="text-4xl font-bold">{totalRespostas}</p>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {dadosAgregados.map((item, index) => (
          <Card key={index} className="flex flex-col border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                {item.pergunta}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center">
              {/* RENDERIZAÇÃO DO GRÁFICO DE BARRAS */}
              {item.tipo === "grafico_barra" && (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={item.data}
                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        background: "white",
                        border: "1px solid #ccc",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Bar dataKey="value" name="Contagem" barSize={30}>
                      {item.data.map((entry: any, idx: number) => {
                        const nameLower = entry.name.toLowerCase();
                        let color = "#3b82f6"; // Azul padrão (blue-500)
                        if (nameLower === "não" || nameLower === "nao") {
                          color = "#ef4444"; // Vermelho (red-500)
                        }
                        return <Cell key={`cell-${idx}`} fill={color} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}

              {/* RENDERIZAÇÃO DO GRÁFICO DE PIZZA */}
              {item.tipo === "grafico_pizza" && (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={item.data}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                      labelLine={false}
                    >
                      {item.data.map((entry: number, idx: number) => (
                        <Cell
                          key={`cell-${idx}`}
                          fill={COLORS[idx % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "white",
                        border: "1px solid #ccc",
                        borderRadius: "0.5rem",
                      }}
                    />

                    <Legend align="left" />
                  </PieChart>
                </ResponsiveContainer>
              )}

              {/* RENDERIZAÇÃO DE ESTATÍSTICA */}
              {item.tipo === "estatistica" && (
                <p className="text-3xl font-bold">
                  {item.data.valor}
                  <span className="text-lg text-muted-foreground ml-2">
                    ({item.data.titulo})
                  </span>
                </p>
              )}

              {/* RENDERIZAÇÃO DE RESPOSTAS DE TEXTO */}
              {item.tipo === "texto" && (
                <ScrollArea className="h-72 w-full rounded-md border p-4">
                  <ul className="space-y-2">
                    {item.data.map((texto: string, i: number) => (
                      <li
                        key={i}
                        className="text-sm border-b pb-2 italic text-gray-700"
                      >
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
    </div>
  );
}
