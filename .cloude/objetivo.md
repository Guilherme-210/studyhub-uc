# OBJETIVO

Analise completamente este projeto Front-end React e gere uma documentação técnica detalhada da arquitetura, organização, padrões e funcionalidades utilizadas.

A análise deve considerar:

* estrutura de pastas
* arquitetura do projeto
* stack utilizada
* padrões de código
* gerenciamento de estado
* roteamento
* chamadas de API
* componentes reutilizáveis
* estilos
* hooks
* providers
* contextos
* tipagens
* validações
* regras de negócio identificáveis
* integrações externas
* performance
* tratamento de erros
* padrões de nomenclatura
* convenções utilizadas

---

# RESULTADO ESPERADO

Gerar uma pasta:

/docs/context/

com múltiplos arquivos `.md`.

Cada arquivo deve documentar uma área específica do sistema.

---

# ESTRUTURA DOS ARQUIVOS

## 1. project-overview.md

Explicar:

* objetivo geral do projeto
* domínio de negócio identificado
* principais funcionalidades
* fluxo geral da aplicação
* visão macro da arquitetura

---

## 2. stack-and-technologies.md

Documentar:

* React version
* TypeScript
* framework utilizado (Next.js, Vite, CRA etc.)
* bibliotecas principais
* gerenciamento de estado
* libs de UI
* libs de formulários
* libs de requisição
* autenticação
* ferramentas de build
* lint/format
* testes
* CI/CD identificado

Explicar:

* para que cada tecnologia é usada
* impacto na arquitetura

---

## 3. architecture.md

Explicar detalhadamente:

* arquitetura utilizada
* componentização
* separação de responsabilidades
* organização por módulos/features
* padrão de containers/pages/components
* composição dos layouts
* fluxo de dados
* fluxo de renderização
* comunicação entre camadas
* estratégia de estado global/local
* estratégia de cache
* estratégia de providers

Identificar se utiliza:

* Feature-based architecture
* Layered architecture
* Clean Architecture
* Atomic Design
* MVC
* Modular architecture
* Domain Driven patterns
* Hooks pattern
* Service layer
* Repository pattern

---

## 4. folder-structure.md

Mapear toda a estrutura principal do projeto.

Explicar:

* responsabilidade de cada pasta
* convenções utilizadas
* organização dos módulos
* organização dos assets
* aliases configurados
* padrões de exportação

Gerar exemplos reais encontrados no código.

---

## 5. routing.md

Documentar:

* sistema de rotas
* rotas públicas/privadas
* layouts
* nested routes
* middleware
* guards
* navegação
* breadcrumbs
* lazy loading
* code splitting

Explicar o fluxo de navegação do sistema.

---

## 6. state-management.md

Documentar:

* Context API
* Redux
* Zustand
* React Query
* SWR
* MobX
* hooks customizados

Explicar:

* como os estados são organizados
* fluxo de atualização
* cache
* invalidação
* sincronização com API

---

## 7. api-and-services.md

Documentar:

* estrutura das chamadas HTTP
* clients
* interceptors
* autenticação
* refresh token
* tratamento de erros
* services
* organização das APIs
* DTOs
* schemas

Mapear:

* endpoints identificáveis
* estratégia de integração

---

## 8. styling-system.md

Explicar:

* metodologia de estilização
* CSS Modules
* Styled Components
* Tailwind
* MUI
* Sass
* tokens
* themes
* responsividade
* breakpoints
* design system
* reutilização visual

---

## 9. components.md

Mapear:

* componentes globais
* componentes reutilizáveis
* padrões de composição
* props patterns
* compound components
* controlled/uncontrolled components

Identificar componentes críticos do sistema.

---

## 10. hooks-and-utils.md

Documentar:

* hooks customizados
* helpers
* utils
* formatadores
* validações
* abstrações reutilizáveis

Explicar responsabilidade e exemplos de uso.

---

## 11. authentication.md

Caso exista autenticação, documentar:

* login
* sessão
* tokens
* guards
* refresh token
* permissões
* RBAC
* persistência

---

## 12. performance.md

Analisar:

* lazy loading
* memoization
* dynamic imports
* React.memo
* useMemo
* useCallback
* otimizações identificadas
* possíveis gargalos

---

## 13. conventions.md

Documentar:

* padrões de nomenclatura
* padrões de commits identificados
* padrões de arquivos
* organização de imports
* padrões de componentes
* padrões de hooks
* padrões de tipagem

---

## 14. known-errors.md

Criar um arquivo SEPARADO apenas para erros e problemas encontrados.

Documentar:

* erros de arquitetura
* possíveis bugs
* code smells
* componentes muito acoplados
* problemas de performance
* duplicação
* tipagens frágeis
* any excessivo
* hooks problemáticos
* dependências circulares
* problemas de responsividade
* problemas de acessibilidade
* problemas de organização
* warnings encontrados
* melhorias recomendadas

Cada problema deve conter:

* descrição
* impacto
* nível de criticidade
* sugestão de solução

---

# REGRAS IMPORTANTES

* NÃO inventar informações
* Analisar apenas o que realmente existir no código
* Sempre citar exemplos reais encontrados
* Explicar a arquitetura de forma técnica
* Explicar o motivo das decisões arquiteturais identificadas
* Priorizar clareza técnica
* Utilizar Markdown bem estruturado
* Criar títulos e subtítulos organizados
* Gerar documentação profissional
* Utilizar linguagem técnica de engenharia de software
* Sempre que possível incluir fluxos e relações entre módulos

---

# FORMATO

Todos os arquivos devem ser gerados em:
`/docs/context/`

Formato:
`.md`

Estrutura:

* títulos hierárquicos
* listas
* tabelas quando necessário
* exemplos reais de código
* trechos relevantes do projeto