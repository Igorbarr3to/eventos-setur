'use client'

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { SurveyFormData } from "../../types/types";
import { useEffect } from "react";

export default function FormEvento() {
    const form = useForm<SurveyFormData>({
        defaultValues: {
            perfil: '',
            comoSoube: '',
            outroComoSoubeText: '',
            veioOutraCidade: '',
            hospedagem: '',
            outroHospedagemText: '',
            gasto: '',
            outroGastoText: '',
            beneficiosEconomicos: '',
            maiorImpacto: '',
            outroImpactoText: '',
            organizacao: '',
            acessibilidade: '',
            turismo: '',
            impactoAmbiental: '',
            sustentabilidade: '',
            visitaTuristica: '',
            recomendaria: '',
        }
    });

    const veioOutraCidade = form.watch("veioOutraCidade");
    const beneficiosEconomicos = form.watch("beneficiosEconomicos");
    const comoSoube = form.watch("comoSoube");
    const hospedagem = form.watch("hospedagem");
    const gasto = form.watch("gasto");
    const maiorImpacto = form.watch("maiorImpacto");

    useEffect(() => {
        if (veioOutraCidade === 'Não') {
            form.setValue('hospedagem', '');
            form.setValue('outroHospedagemText', '');
        }
    }, [veioOutraCidade, form]);

    useEffect(() => {
        if (beneficiosEconomicos !== 'Sim') {
            form.setValue('maiorImpacto', '');
            form.setValue('outroImpactoText', '');
        }
    }, [beneficiosEconomicos, form]);

    useEffect(() => {
        if (comoSoube !== 'Outro') {
            form.setValue('outroComoSoubeText', '');
        }
    }, [comoSoube, form]);

    useEffect(() => {
        if (hospedagem !== 'Outro') {
            form.setValue('outroHospedagemText', '');
        }
    }, [hospedagem, form]);

    useEffect(() => {
        if (gasto !== 'Outro') {
            form.setValue('outroGastoText', '');
        }
    }, [gasto, form]);

    useEffect(() => {
        if (maiorImpacto !== 'Outro') {
            form.setValue('outroImpactoText', '');
        }
    }, [maiorImpacto, form]);


    const onSubmit = async (data: SurveyFormData) => {
        // Exemplo de como você pode prevenir múltiplos envios, se for o caso
        if (localStorage.getItem('formEnviado') === 'sim') {
            alert('Você já respondeu à pesquisa.');
            return;
        }

        const dataToSend: Partial<SurveyFormData> = { ...data };

        // Limpeza de campos condicionais
        if (dataToSend.veioOutraCidade !== 'Sim') {
            delete dataToSend.hospedagem;
            delete dataToSend.outroHospedagemText;
        }
        if (dataToSend.beneficiosEconomicos !== 'Sim') {
            delete dataToSend.maiorImpacto;
            delete dataToSend.outroImpactoText;
        }

        // Ajuste de campos "Outro"
        if (dataToSend.comoSoube === 'Outro') {
            dataToSend.comoSoube = dataToSend.outroComoSoubeText;
        }
        delete dataToSend.outroComoSoubeText;

        if (dataToSend.hospedagem === 'Outro') {
            dataToSend.hospedagem = dataToSend.outroHospedagemText;
        }
        delete dataToSend.outroHospedagemText;

        if (dataToSend.gasto === 'Outro') {
            dataToSend.gasto = dataToSend.outroGastoText;
        }
        delete dataToSend.outroGastoText;

        if (dataToSend.maiorImpacto === 'Outro') {
            dataToSend.maiorImpacto = dataToSend.outroImpactoText;
        }
        delete dataToSend.outroImpactoText;

        const jsonData = JSON.stringify(dataToSend, null, 2);
        console.log(jsonData); // Exibe o JSON no console

        try {
            // TODO: Substitua '/api/pesquisa' pelo seu endpoint real de API
            const response = await fetch('/api/pesquisa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                alert('Resposta enviada com sucesso! Obrigado 🙂');
                localStorage.setItem('formEnviado', 'sim'); // Marca que o formulário foi enviado
                form.reset(); // Limpa o formulário após o envio
            } else {
                alert('Ocorreu um erro ao enviar. Tente novamente.');
                // Em um cenário offline-first, aqui você salvaria no IndexedDB
            }
        } catch (error) {
            console.error('Erro ao enviar:', error);
            alert('Erro de rede. Verifique sua conexão.');
            // Em um cenário offline-first, aqui você salvaria no IndexedDB
        }
    };

    const handleClearQuestion = (fieldName: keyof SurveyFormData) => {
        form.setValue(fieldName, '' as any, { shouldValidate: true });

        if (fieldName === 'comoSoube') {
            form.setValue('outroComoSoubeText', '');
        } else if (fieldName === 'hospedagem') {
            form.setValue('outroHospedagemText', '');
        } else if (fieldName === 'gasto') {
            form.setValue('outroGastoText', '');
        } else if (fieldName === 'maiorImpacto') {
            form.setValue('outroImpactoText', '');
        }
    };

    return (
        <div className="sm:p-6 lg:p-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-2 py-4 bg-white rounded-lg shadow-md lg:mx-40">
                    {/* Pergunta 1: Perfil do respondente */}
                    <FormField
                        control={form.control}
                        name="perfil"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <div className="flex items-center justify-between mb-2">
                                    <FormLabel>1. Perfil do respondente:</FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleClearQuestion('perfil')}
                                    >
                                        Limpar resposta
                                    </Button>
                                </div>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex flex-col space-y-1" // Opções em coluna
                                    >
                                        {/* Todas as FormItem aqui precisam de 'flex items-center' para rádio e label lado a lado */}
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Participante do evento" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Participante do evento</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Morador da Região" className="border border-zinc-900" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Morador da Região</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Comerciante Local" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Comerciante Local</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Organizador" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Organizador</FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Pergunta 2: Como ficou sabendo do evento? */}
                    <FormField
                        control={form.control}
                        name="comoSoube"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <div className="flex items-center justify-between mb-2">
                                    <FormLabel>2. Como ficou sabendo do evento? </FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleClearQuestion('comoSoube')}
                                    >
                                        Limpar Resposta
                                    </Button>
                                </div>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex flex-col space-y-1" // Opções em coluna
                                    >
                                        {/* Todas as FormItem aqui precisam de 'flex items-center' */}
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Redes sociais" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Redes sociais </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Amigos/familiares" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Amigos/familiares </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="TV/rádio" />
                                            </FormControl>
                                            <FormLabel className="font-normal">TV/rádio </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Cartaz ou outdoor" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Cartaz ou outdoor </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Outro" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Outro:</FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Campo Outro: sempre visível, mas só relevante se "Outro" estiver selecionado */}
                    <FormField
                        control={form.control}
                        name="outroComoSoubeText"
                        render={({ field }) => (
                            <FormItem className="ml-8">
                                <FormLabel>Por favor, especifique:</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Ex: Jornal local, evento anterior" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Pergunta 3: Veio de outra cidade? */}
                    <FormField
                        control={form.control}
                        name="veioOutraCidade"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <div className="flex items-center justify-between mb-2">
                                    <FormLabel>3. Você veio de outra cidade para participar do evento? </FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleClearQuestion('veioOutraCidade')}
                                    >
                                        Limpar Resposta
                                    </Button>
                                </div>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex space-x-4" // Opções lado a lado (row)
                                    >
                                        {/* Todas as FormItem aqui precisam de 'flex items-center' */}
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Sim" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Sim </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Não" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Não </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Pergunta 4: Onde se hospedou? */}
                    <FormField
                        control={form.control}
                        name="hospedagem"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <div className="flex items-center justify-between mb-2">
                                    <FormLabel>4. Se veio de outra cidade, onde você se hospedou? </FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleClearQuestion('hospedagem')}
                                    >
                                        Limpar Resposta
                                    </Button>
                                </div>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex flex-col space-y-1" // Opções em coluna
                                    >
                                        {/* Todas as FormItem aqui precisam de 'flex items-center' */}
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Hotel/Pousada" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Hotel/Pousada </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Airbnb" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Airbnb </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Casa de amigos/familiares" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Casa de amigos/familiares </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Não me hospedei na cidade" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Não me hospedei na cidade </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Outro" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Outro: </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Campo Outro para hospedagem*/}
                    <FormField
                        control={form.control}
                        name="outroHospedagemText"
                        render={({ field }) => (
                            <FormItem className="ml-8">
                                <FormLabel>Por favor, especifique onde se hospedou:</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Ex: Casa de temporada" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Pergunta 5: Gasto no evento */}
                    <FormField
                        control={form.control}
                        name="gasto"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <div className="flex items-center justify-between mb-2">
                                    <FormLabel>5. Qual foi seu gasto no evento aproximado? </FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleClearQuestion('gasto')}
                                    >
                                        Limpar Resposta
                                    </Button>
                                </div>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        {/* Todas as FormItem aqui precisam de 'flex items-center' */}
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Menos de R$100" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Menos de R$100 </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="R$100-R$300" />
                                            </FormControl>
                                            <FormLabel className="font-normal">R$100-R$300 </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="R$300-R$500" />
                                            </FormControl>
                                            <FormLabel className="font-normal">R$300-R$500 </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Acima de R$500" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Acima de R$500 </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Outro" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Outro: </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Campo Outro para gasto*/}
                    <FormField
                        control={form.control}
                        name="outroGastoText"
                        render={({ field }) => (
                            <FormItem className="ml-8">
                                <FormLabel>Por favor, especifique seu gasto:</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Ex: R$600" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Pergunta 6: Benefícios econômicos? */}
                    <FormField
                        control={form.control}
                        name="beneficiosEconomicos"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <div className="flex items-center justify-between mb-2">
                                    <FormLabel>6. Você acredita que o evento trouxe benefícios econômicos para região? </FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleClearQuestion('beneficiosEconomicos')}
                                    >
                                        Limpar Resposta
                                    </Button>
                                </div>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex space-x-4" // Opções lado a lado (row)
                                    >
                                        {/* Todas as FormItem aqui precisam de 'flex items-center' */}
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Sim" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Sim </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Não" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Não </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Não sei dizer" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Não sei dizer </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Pergunta 7: Qual o maior impacto? */}
                    <FormField
                        control={form.control}
                        name="maiorImpacto"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <div className="flex items-center justify-between mb-2">
                                    <FormLabel>7. Qual o maior impacto você percebeu? </FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleClearQuestion('maiorImpacto')}
                                    >
                                        Limpar Resposta
                                    </Button>
                                </div>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex flex-col space-y-1" // Opções em coluna
                                    >
                                        {/* Todas as FormItem aqui precisam de 'flex items-center' */}
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Aumento nas vendas do comércio local" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Aumento nas vendas do comércio local </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Maior movimento em hotéis e restaurantes" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Maior movimento em hotéis e restaurantes </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Geração de empregos temporários" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Geração de empregos temporários </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Atração de investimentos para a cidade" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Atração de investimentos para a cidade </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Outro" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Outro: </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Campo Outro para impacto*/}
                    <FormField
                        control={form.control}
                        name="outroImpactoText"
                        render={({ field }) => (
                            <FormItem className="ml-8">
                                <FormLabel>Por favor, especifique o impacto:</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Ex: Melhoria da infraestrutura" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Pergunta 8: Avaliação da organização */}
                    <FormField
                        control={form.control}
                        name="organizacao"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <div className="flex items-center justify-between mb-2">
                                    <FormLabel>8. Como você avalia a organização do evento? </FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleClearQuestion('organizacao')}
                                    >
                                        Limpar Resposta
                                    </Button>
                                </div>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        {/* Todas as FormItem aqui precisam de 'flex items-center' */}
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Excelente" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Excelente </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Boa" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Boa </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Regular" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Regular </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Ruim" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Ruim </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Péssima" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Péssima </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Pergunta 9: Acessibilidade */}
                    <FormField
                        control={form.control}
                        name="acessibilidade"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <div className="flex items-center justify-between mb-2">
                                    <FormLabel>9. O evento foi acessível para diferentes públicos (pessoas com deficiência, idosos, etc.)? </FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleClearQuestion('acessibilidade')}
                                    >
                                        Limpar Resposta
                                    </Button>
                                </div>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex space-x-4" // Opções lado a lado (row)
                                    >
                                        {/* Todas as FormItem aqui precisam de 'flex items-center' */}
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Sim" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Sim </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Parcialmente" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Parcialmente </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Não" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Não </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Pergunta 10: Promoveu turismo local? */}
                    <FormField
                        control={form.control}
                        name="turismo"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <div className="flex items-center justify-between mb-2">
                                    <FormLabel>10. Você acha que o evento ajudou a promover o turismo local? </FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleClearQuestion('turismo')}
                                    >
                                        Limpar Resposta
                                    </Button>
                                </div>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex space-x-4"
                                    >
                                        {/* Todas as FormItem aqui precisam de 'flex items-center' */}
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Sim" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Sim </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Não" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Não </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Não sei dizer" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Não sei dizer </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Pergunta 11: Impacto ambiental negativo? */}
                    <FormField
                        control={form.control}
                        name="impactoAmbiental"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <div className="flex items-center justify-between mb-2">
                                    <FormLabel>11. Você notou excesso de lixo ou impacto negativo no meio ambiente devido ao evento? </FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleClearQuestion('impactoAmbiental')}
                                    >
                                        Limpar Resposta
                                    </Button>
                                </div>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex space-x-4"
                                    >
                                        {/* Todas as FormItem aqui precisam de 'flex items-center' */}
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Sim" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Sim </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Não" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Não </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Pergunta 12: Práticas sustentáveis no futuro? */}
                    <FormField
                        control={form.control}
                        name="sustentabilidade"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <div className="flex items-center justify-between mb-2">
                                    <FormLabel>12. Você acha que o evento deveria adotar mais práticas sustentáveis no futuro? </FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleClearQuestion('sustentabilidade')}
                                    >
                                        Limpar Resposta
                                    </Button>
                                </div>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex space-x-4"
                                    >
                                        {/* Todas as FormItem aqui precisam de 'flex items-center' */}
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Sim" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Sim </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Não" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Não </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Não sei dizer" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Não sei dizer </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Pergunta 13: Visitou outras atrações? */}
                    <FormField
                        control={form.control}
                        name="visitaTuristica"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <div className="flex items-center justify-between mb-2">
                                    <FormLabel>13. Além do evento, você visitou outras atrações turísticas na cidade? </FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleClearQuestion('visitaTuristica')}
                                    >
                                        Limpar Resposta
                                    </Button>
                                </div>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex space-x-4"
                                    >
                                        {/* Todas as FormItem aqui precisam de 'flex items-center' */}
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Sim" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Sim </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Não" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Não </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Pergunta 14: Recomendaria o evento? */}
                    <FormField
                        control={form.control}
                        name="recomendaria"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <div className="flex items-center justify-between mb-2">
                                    <FormLabel>14. Você recomendaria este evento para outras pessoas?</FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleClearQuestion('recomendaria')}
                                    >
                                        Limpar Resposta
                                    </Button>
                                </div>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex space-x-4"
                                    >
                                        {/* Todas as FormItem aqui precisam de 'flex items-center' */}
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Sim" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Sim</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="Não" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Não</FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="text-center mx-[10%] md:mx-[30%]">
                        <Button type="submit"
                            className="w-full text-slate-200 text-lg bg-slate-700 hover:border-2 hover:border-slate-900 hover:bg-slate-50 hover:text-slate-950"
                        >
                            Enviar Pesquisa
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}