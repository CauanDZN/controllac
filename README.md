# Controllac

Controle de validade de produtos e lotes para pequenos negócios de laticínios e frios — mercearias, padarias, distribuidores — que hoje não usam nenhum sistema pra isso. **100% offline**, sem cadastro, sem servidor, sem custo de assinatura.

O projeto nasceu em 2022 como uma ideia de gestão de laticínios e frios e foi retomado e modernizado em 2026: removida a dependência de Firebase/login/backend que nunca chegou a funcionar de verdade, e reconstruído do zero sobre Expo SDK 57, com o modelo de dados real de **produto → lotes** que dá nome ao projeto.

## O problema que resolve

Comércios pequenos de laticínios perdem dinheiro com produtos que vencem na prateleira porque não têm visibilidade de _o que_ está vencendo e _quando_. Planilha não avisa sozinha; sistema de supermercado é caro e complexo demais pra esse porte de negócio. O Controllac é feito pra rodar no celular do dono/funcionário, sem internet, e avisar antes do prejuízo acontecer.

## Funcionalidades

- **Catálogo de produtos** — cada produto (nome, código de barras, categoria) é cadastrado uma vez e reaproveitado em várias entregas.
- **Lotes por produto** — cada entrega vira um lote com sua própria quantidade, fornecedor, data de fabricação e validade. Um mesmo produto pode ter vários lotes em aberto ao mesmo tempo.
- **Leitura de código de barras com reconhecimento local** — ao escanear um código já visto antes, o app reconhece o produto automaticamente e pula direto pra tela de quantidade/validade do novo lote. Não depende de internet nem de nenhuma API externa: o "aprendizado" é feito localmente, a partir dos produtos já cadastrados no próprio aparelho.
- **Ordenação por validade (FEFO)** — a lista de lotes vem sempre ordenada do que vence primeiro pro que vence por último, seguindo a disciplina padrão de manuseio de perecíveis (_First Expire, First Out_).
- **Notificações locais de vencimento** — cada lote agenda um lembrete no próprio sistema operacional para 3 dias antes da validade, sem precisar de servidor push nem do app aberto.
- **Busca e filtro** — por nome ou código de barras, e por status (vencido / vencendo / dentro da validade).
- **Edição e exclusão** — de produtos e de lotes, com confirmação em cascata ao excluir um produto que já tem lotes.
- **Resumo por categoria** — gráfico e detalhamento mês a mês de quantos lotes existem por categoria de produto.

## O que não é

Não é um ERP nem concorre com sistema de supermercado. Não tem controle fiscal, não emite nota, não faz integração com balança ou PDV. É uma ferramenta enxuta de controle de validade — se o negócio crescer a ponto de precisar de algo maior, esse é o momento de migrar para um sistema de gestão completo.

## Stack técnica

| Camada           | Tecnologia                                                                     |
| ---------------- | ------------------------------------------------------------------------------ |
| Framework        | React Native + Expo SDK 57 (workflow gerenciado, Continuous Native Generation) |
| Linguagem        | TypeScript (`strict: true`)                                                    |
| Navegação        | React Navigation (Stack raiz + Bottom Tabs)                                    |
| Estilo           | styled-components                                                              |
| Formulários      | react-hook-form + yup                                                          |
| Armazenamento    | AsyncStorage (100% local, sem backend)                                         |
| Notificações     | expo-notifications (locais, agendadas no aparelho)                             |
| Câmera / scanner | expo-camera                                                                    |
| Testes           | Jest + jest-expo + Testing utilities do React Native                           |
| Qualidade        | ESLint (eslint-config-expo) + Prettier + Husky/lint-staged                     |

Não há backend: o app inteiro roda no cliente, com o AsyncStorage do dispositivo como única fonte de dados. Ver a seção [Arquitetura: por que sem backend](#arquitetura-por-que-sem-backend) para o raciocínio por trás dessa escolha.

## Estrutura do projeto

```
src/
  components/     Button, Input, InputForm, CategoryButton, BatchCard,
                   ProductListItem, SearchInput, StatusFilter
  screens/
    Lotes/         lista de lotes (busca, filtro, FEFO) — tela inicial
    Produtos/       catálogo de produtos
    ProdutoForm/    criar/editar produto
    LoteForm/       criar/editar lote
    Register/       tab "Cadastrar" — escolhe produto existente ou cria um novo
    Scanner/        leitura de código de barras
    CategorySelect/ seletor de categoria
    Resume/         resumo por categoria
  storage/         productsStorage.ts, batchesStorage.ts (AsyncStorage)
  types/           Product, Batch
  utils/           categories.ts, date.ts, notifications.ts
  routes/          Stack raiz + Bottom Tabs
__tests__/         testes de unidade (utils e storage)
__mocks__/         mocks de módulos nativos pro Jest
```

## Como rodar

Pré-requisitos: Node 20+, o app [Expo Go](https://expo.dev/go) no celular (ou um emulador Android/iOS configurado).

```bash
npm install
npm start
```

Escaneie o QR code com o Expo Go, ou pressione `a`/`i` no terminal para abrir num emulador Android/iOS.

### Scripts disponíveis

| Comando                           | O que faz                                                         |
| --------------------------------- | ----------------------------------------------------------------- |
| `npm start`                       | Inicia o servidor de desenvolvimento Expo                         |
| `npm run android` / `npm run ios` | Builda e roda um app nativo local (requer Android Studio / Xcode) |
| `npm test`                        | Roda a suíte de testes (Jest)                                     |
| `npm run typecheck`               | Verifica tipos (`tsc --noEmit`)                                   |
| `npm run lint`                    | Roda o ESLint                                                     |
| `npm run format`                  | Formata o projeto com Prettier                                    |

### Build para publicação

O projeto usa Continuous Native Generation — as pastas `android/` e `ios/` **não são versionadas**, são geradas sob demanda:

```bash
npx expo prebuild        # gera android/ e ios/ localmente, se precisar mexer em código nativo
npx eas build            # ou builda na nuvem via EAS, sem precisar gerar nada localmente
```

## Testes

```bash
npm test
```

Cobre a lógica de negócio que já teve bugs reais no passado: máscara e validação de datas, cálculo de status de vencimento, e o CRUD completo de produtos e lotes (incluindo agendamento/cancelamento de notificações).

## Arquitetura: por que sem backend

O app não tem — e propositalmente não terá, por padrão — um backend. Isso não é uma limitação técnica, é a proposta de valor: o público-alvo (comércios pequenos, muitas vezes sem internet estável no ponto de venda) precisa que o app funcione **sempre**, com ou sem sinal. Qualquer dependência de rede vira um ponto de falha exatamente no momento mais crítico (recebendo mercadoria, no meio do estoque).

Se no futuro fizer sentido oferecer sincronização entre aparelhos ou múltiplos usuários por loja, o caminho recomendado é **local-first**: o AsyncStorage continua sendo a fonte da verdade e a sincronização com um backend vira uma camada opcional por cima, nunca um requisito para o app funcionar.

## Estado atual e próximos passos

Este é um protótipo funcional, verificado estaticamente (tipos, lint, testes automatizados, geração do projeto nativo), mas **ainda não testado num dispositivo real**. Antes de qualquer piloto com um usuário de verdade, é necessário rodar o app via Expo Go ou build nativo e validar o fluxo ponta a ponta.

Fora do escopo atual, por ordem de prioridade:

1. Backup/exportação dos dados (hoje, perder o aparelho é perder o histórico inteiro).
2. Lead time de notificação configurável pelo usuário (hoje fixo em 3 dias).
3. Relatório exportável (CSV/PDF) de lotes vencidos/vencendo — útil pra fiscalização sanitária e pra cobrar fornecedor por entrega já perto do vencimento.
4. Tela de primeiro uso explicando o modelo produto → lote pra quem abre o app pela primeira vez.
5. Ícone e identidade visual definitivos (hoje reaproveita um placeholder).

## Autoria

Cauan Victor — [github.com/CauanDZN](https://github.com/CauanDZN)
