# Formulário de Pesquisa Campeonato Estadual de Motocross Rondoniense 2025

Este projeto consiste em um formulário de pesquisa interativo desenvolvido para coletar feedback sobre o Campeonato Estadual de Motocross Rondoniense de 2025, um evento significativo na região de Rondônia. O formulário é projetado para ser usado por participantes, moradores da região, comerciantes locais e organizadores, coletando dados essenciais sobre a experiência, impacto e percepções do evento.

## Descrição do Projeto

O objetivo principal é fornecer uma ferramenta eficiente e moderna para a SETUR (Secretaria de Estado do Turismo) coletar informações valiosas para o planejamento de futuras edições do campeonato. O formulário captura dados sobre como os respondentes souberam do evento, seus gastos aproximados, a percepção sobre os benefícios econômicos gerados, avaliação da organização, acessibilidade, contribuição para o turismo local e impacto ambiental, além da probabilidade de recomendação.

## Funcionalidades Principais

* **Coleta de Dados Abrangente:** Questionário detalhado para diversos perfis de respondentes.
* **Controles de Formulário Modernos:** Utilização de `RadioGroup` e `Input` do `shadcn/ui` para uma interface intuitiva.
* **Gerenciamento de Estado Otimizado:** Implementado com `react-hook-form` para um controle de formulário eficiente e validação simplificada.
* **Lógica de Limpeza de Dados Inteligente:** Embora todos os campos sejam visíveis, o formulário garante que os dados JSON enviados sejam limpos de informações irrelevantes com base nas respostas condicionais (ex: campos de hospedagem são resetados se o participante não veio de outra cidade).
* **Botão "Limpar Resposta" por Pergunta:** Oferece flexibilidade ao usuário para redefinir respostas individuais sem afetar o restante do formulário.
* **Geração de JSON para Backend:** As respostas são formatadas em um objeto JSON estruturado e exibidas no console do navegador, prontas para serem integradas a qualquer API de backend para persistência de dados.
* **Design Responsivo:** Utiliza Tailwind CSS para garantir uma experiência de usuário consistente em diferentes dispositivos e tamanhos de tela.

## Tecnologias Utilizadas

O projeto é construído sobre uma pilha de tecnologias modernas para desenvolvimento frontend:

* **React.js:** Biblioteca JavaScript para construção de interfaces de usuário declarativas e baseadas em componentes.
* **TypeScript:** Superset do JavaScript que adiciona tipagem estática, aumentando a segurança do código e a experiência do desenvolvedor.
* **React Hook Form:** Uma biblioteca performática e flexível para gerenciamento de formulários no React, com foco em simplicidade e validação eficiente.
* **Shadcn/ui:** Uma coleção de componentes de interface de usuário reutilizáveis e acessíveis, estilizados com Tailwind CSS e construídos sobre Radix UI Primitives.
* **Tailwind CSS:** Um framework CSS utility-first que permite construir designs personalizados rapidamente, sem sair do seu HTML (JSX).
* **Vite:** Um bundler frontend de próxima geração que oferece um ambiente de desenvolvimento extremamente rápido e otimizado para produção.

## Como Executar o Projeto

Siga estas instruções para configurar e rodar o projeto em seu ambiente de desenvolvimento local.

### Pré-requisitos

Certifique-se de ter os seguintes softwares instalados em sua máquina:

* [**Node.js**](https://nodejs.org/en/download/) (versão LTS recomendada)
* [**npm**](https://www.npmjs.com/get-npm) (vem junto com o Node.js) ou [**Yarn**](https://yarnpkg.com/getting-started/install)

### Instalação

1.  **Clone o Repositório:**
    Abra seu terminal (ou Git Bash) e execute o comando para clonar o projeto:
    ```bash
    git clone https://github.com/Igorbarr3to/form-evento-motocross-setur.git
    ```

2.  **Navegue até o Diretório do Projeto:**
    Após clonar, entre na pasta do projeto:
    ```bash
    cd form-evento-motocross-setur
    ```

3.  **Instale as Dependências:**
    Execute o comando para instalar todas as dependências do projeto:
    ```bash
    npm install
    # Ou, se estiver usando Yarn:
    # yarn install
    ```
    *Se você encontrar problemas com os componentes do shadcn/ui ou react-hook-form, certifique-se de que foram adicionados corretamente seguindo a documentação oficial ou execute:*
    ```bash
    npm install react-hook-form zod
    npx shadcn-ui@latest add form radio-group input button
    # E quaisquer outros componentes shadcn/ui que estejam faltando.
    ```

### Rodando o Servidor de Desenvolvimento

Para iniciar o aplicativo em modo de desenvolvimento:

```bash
npm run dev
# Ou, se estiver usando Yarn:
# yarn dev
