# StudyHub

Plataforma de organização de estudos para universitários. Reúne em um só lugar as ferramentas necessárias para planejar, executar e acompanhar a rotina acadêmica — individualmente ou em grupo.

## Funcionalidades

| Módulo | Descrição |
|--------|-----------|
| **Tarefas** | Criação e gerenciamento de tarefas com prazos e prioridades |
| **Kanban** | Board visual para acompanhar o progresso das atividades |
| **Calendário** | Visualização de eventos, prazos e horários de estudo |
| **Notas** | Anotações rápidas organizadas por matéria ou tema |
| **Pomodoro** | Timer Pomodoro para sessões de foco com pausas programadas |
| **Grupos** | Criação e participação em grupos de estudo por curso/matéria |
| **Conversas** | Chat integrado para comunicação nos grupos de estudo |

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **UI**: Material UI 9 + Emotion + styled-components + Radix UI + Tailwind CSS
- **State**: TanStack React Query 5 + React Hook Form 7
- **Drag and Drop**: dnd-kit
- **Validação**: Zod
- **Gráficos**: Recharts
- **Ícones**: Lucide React
- **Tema**: next-themes (dark/light mode)

## Estrutura do Projeto

```
src/
├── app/
│   ├── page.tsx               # Landing page
│   └── organizacao/           # Área autenticada
│       ├── tarefas/
│       ├── kanban/
│       ├── calendario/
│       ├── notas/
│       ├── pomodoro/
│       ├── grupos/
│       └── conversas/
├── components/
│   ├── landing/               # Seções da landing page
│   ├── organization/          # Componentes da área logada
│   └── ui/                    # Componentes base (shadcn/ui)
├── entities/                  # Domínios de negócio (group, note, session, task)
├── features/                  # Features transversais (auth, theme)
├── hooks/                     # Custom hooks
├── services/                  # Camada de API
├── shared/                    # Constants, types e utils compartilhados
└── types/                     # Tipos TypeScript globais
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 9

## Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd StudyHub

# Instale as dependências
pnpm install
```

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Exemplo — copie e preencha com seus valores
cp .env.example .env.local
```

> As variáveis necessárias devem ser documentadas no arquivo `.env.example`.

## Scripts

```bash
pnpm dev        # Inicia o servidor de desenvolvimento
pnpm build      # Gera o build de produção
pnpm start      # Inicia o servidor em modo produção
pnpm lint       # Executa o ESLint
```

## Convenções

- **Arquivos e funções**: inglês, kebab-case (`study-card.tsx`, `getGroups()`)
- **Componentes React**: PascalCase (`StudyCard`)
- **Hooks**: camelCase com prefixo `use` (`useGetGroups`)
- **Constantes**: UPPER_SNAKE_CASE (`APP_ROUTES`)
- **Imports**: alias `@/` para `src/`

## Contribuindo

Consulte [docs/Welcome/Contributing.md](docs/Welcome/Contributing.md) para as diretrizes de contribuição.
