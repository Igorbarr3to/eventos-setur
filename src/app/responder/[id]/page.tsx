"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Formulario, Pergunta, TipoResposta } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import Image from "next/image";

type FormularioComPerguntas = Formulario & { perguntas: Pergunta[] };

function RenderizarPergunta({
  pergunta,
  control,
  watch,
}: {
  pergunta: Pergunta;
  control: any;
  watch: any;
}) {
  const opcoes = pergunta.opcoesJson as { opcoes?: string[] };
  const valorSelecionado = watch(`respostas.${pergunta.id}`);

  return (
    <FormField
      control={control}
      name={`respostas.${pergunta.id}`}
      render={({ field }) => (
        <FormItem className="bg-white rounded-lg">
          <FormLabel className="text-base font-semibold">
            {pergunta.obrigatoria && (
              <span className="text-red-500 ml-1">*</span>
            )}
            {pergunta.texto}
          </FormLabel>

          <FormControl className="">
            {(() => {
              switch (pergunta.tipoResposta) {
                case TipoResposta.TEXTO:
                  return <Textarea {...field} />;
                case TipoResposta.NUMERO:
                  return (
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? null
                            : parseInt(e.target.value)
                        )
                      }
                    />
                  );
                case TipoResposta.DATA:
                  return <Input type="date" {...field} 
                />;

                case TipoResposta.OPCAO:
                  if (!opcoes?.opcoes) return null;
                  return (
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-2"
                    >
                      {opcoes.opcoes.map((opcao) => (
                        <FormItem
                          key={opcao}
                          className="grid grid-cols-[auto_1fr] items-center space-x-2"
                        >
                          <FormControl>
                            <RadioGroupItem value={opcao} />
                          </FormControl>
                          <FormLabel className="font-normal">{opcao}</FormLabel>
                        </FormItem>
                      ))}

                      {pergunta.incluirOpcaoOutro && (
                        <div className="flex items-center space-x-3">
                          <FormControl>
                            <RadioGroupItem value="outro_texto" />
                          </FormControl>
                          <FormLabel className="font-normal">Outro:</FormLabel>
                          {/* O campo de texto só aparece se "Outro" estiver selecionado */}
                          {valorSelecionado === "outro_texto" && (
                            <FormField
                              control={control}
                              name={`respostas.${pergunta.id}_outro`} // Campo separado para o texto
                              render={({ field: outroField }) => (
                                <FormControl>
                                  <Input
                                    placeholder="Qual?"
                                    {...outroField}
                                    className="flex-1"
                                  />
                                </FormControl>
                              )}
                            />
                          )}
                        </div>
                      )}
                    </RadioGroup>
                  );
                case TipoResposta.MULTIPLA:
                  if (!opcoes?.opcoes) return null;
                  return (
                    <div className="space-y-2">
                      {opcoes.opcoes.map((opcao) => (
                        <FormField
                          key={opcao}
                          control={control}
                          name={`respostas.${pergunta.id}`}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(opcao)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...(field.value || []),
                                          opcao,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value: string) => value !== opcao
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {opcao}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  );

                default:
                  return <Input {...field} />; // fallback seguro
              }
            })()}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default function PaginaDeResposta() {
  const [formulario, setFormulario] = useState<FormularioComPerguntas | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const params = useParams();
  const formId = Array.isArray(params.id) ? params.id[0] : params.id;

  const form = useForm();

  useEffect(() => {
    const fetchFormulario = async () => {
      try {
        // A busca do formulário continua a mesma
        const response = await fetch(`/api/public/formularios/${params.id}`);
        if (!response.ok)
          throw new Error(
            "Este formulário não foi encontrado ou não está mais ativo."
          );
        const data = await response.json();
        setFormulario(data);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFormulario();
  }, [params.id]);

  const onSubmit = async (data: any) => {
    if (!formulario) return;

    // Adicione o estado de "enviando"
    // const [isSubmitting, setIsSubmitting] = useState(false);
    // setIsSubmitting(true);

    try {
      // 1. Transforma os dados do formulário DIRETAMENTE para o formato que a API espera
      const respostasDetalhes = formulario.perguntas
        .map((pergunta) => {
          // Pega o valor da resposta principal e do campo "outro" (se existir)
          let valor = data.respostas?.[pergunta.id];
          const textoOutro = data.respostas?.[`${pergunta.id}_outro`];

          // Lógica para a opção "Outro": Se a opção "outro_texto" foi marcada e
          // o campo de texto foi preenchido, use o texto como o valor final.
          if (valor === "outro_texto" && textoOutro) {
            valor = textoOutro;
          }

          // Ignora a resposta se ela for vazia, nula ou ainda for "outro_texto" (sem preenchimento)
          if (
            valor === undefined ||
            valor === null ||
            valor === "" ||
            valor === "outro_texto"
          ) {
            return null;
          }

          const detalhe: any = { perguntaId: pergunta.id };

          // Mapeia o valor para a coluna correta do banco de dados (valorTexto, valorNumero, etc.)
          switch (pergunta.tipoResposta) {
            case "TEXTO":
              detalhe.valorTexto = String(valor);
              break;
            case "NUMERO":
            case "ESCALA":
              detalhe.valorNumero = Number(valor);
              break;
            case "DATA":
              detalhe.valorData = new Date(valor).toISOString();
              break;
            case "OPCAO": // O valor já é o texto da opção, incluindo o "Outro"
              detalhe.valorOpcao = String(valor);
              break;
            case "MULTIPLA":
              detalhe.valorOpcao = Array.isArray(valor)
                ? valor.join(", ")
                : String(valor);
              break;
          }
          return detalhe;
        })
        .filter(Boolean); // Remove qualquer resposta que resultou em 'null'

      // 2. Monta o payload final para a API
      const payload = {
        pesquisaId: formulario.pesquisaId,
        formularioId: formulario.id,
        respostasDetalhes: respostasDetalhes,
      };

      // 3. Envia para a API correta (/api/respostas)
      const response = await fetch("/api/respostas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Houve um erro ao enviar suas respostas."
        );
      }

      // setSuccess(true); // Supondo que você tenha esse estado
    } catch (err: any) {
      // toast.error(err.message); // Supondo que você use toasts
    } finally {
      // setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        Carregando formulário...
      </div>
    );
  if (success)
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center p-8">
        <h1 className="text-3xl font-bold text-green-600">
          Obrigado por responder!
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Suas respostas foram enviadas com sucesso.
        </p>
      </div>
    );
  if (!formulario)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Erro: Formulário não encontrado.
      </div>
    );

  return (
    <main className="bg-slate-50 min-h-screen">
      <div className="w-full flex justify-center p-2 bg-blue-600/70">
        <Image
          src={"/governo-do-estado-ro.svg"}
          alt="Governo do Estado de Rondônia"
          width={160}
          height={100}
        />
      </div>
      <div className="container mx-auto max-w-3xl bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <header className="border-b pb-4 mb-8 ">
          <h1 className="text-center text-xl font-bold tracking-tight">
            {formulario.nome}
          </h1>
          {formulario.descricao && (
            <p className="text-sm text-muted mt-2">{formulario.descricao}</p>
          )}
        </header>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {formulario.perguntas.map((pergunta) => (
              <RenderizarPergunta
                key={pergunta.id}
                pergunta={pergunta}
                control={form.control}
                watch={form.watch}
              />
            ))}
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full text-lg bg-blue-400"
            >
              {form.formState.isSubmitting ? "Enviando..." : "Enviar Respostas"}
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
