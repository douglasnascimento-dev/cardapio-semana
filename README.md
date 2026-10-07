# Cardápio da Semana

Aplicação web (SPA) para planejar as refeições da semana com receitas do mundo todo. Você escolhe receitas, monta o cardápio de segunda a domingo, e a **lista de compras é gerada automaticamente**, com os ingredientes repetidos já agrupados.

Projeto 1 da disciplina **Programação Web Fullstack**

**ACESSO AO VERCEL**: https://cardapio-semana-chi.vercel.app/

---

## Funcionalidades

- **Explorar receitas**: busca por nome, filtros por categoria, origem e ingrediente.
- **Detalhes da receita**: ingredientes com foto, modo de preparo em passos numerados, tags, vídeo e fonte.
- **Favoritos**: marcar/desmarcar pelo coração do card ou pela janela de detalhes.
- **Planejador semanal**: 7 dias × almoço e jantar. Adicionar pela janela de detalhes ou direto do planejador, escolhendo entre os favoritos.
- **Lista de compras**: gerada a partir do plano, agrupada por ingrediente, com progresso e itens marcados como comprados.
- **Persistência**: favoritos, plano e lista ficam salvos no navegador.
- **Responsivo**: adptado para visualização no celular.

## Requisitos do projeto

| Requisito | Escolha | Onde está |
|---|---|---|
| API JSON aberta | [TheMealDB](https://www.themealdb.com/api.php) (sem chave, com CORS) | `src/api/mealdb.js` |
| Hook/funcionalidade do React | **react-redux** (com Redux Toolkit) | `src/store/` |
| Biblioteca externa | **MUI (Material UI)** | `src/theme.js` e todos os componentes |
| SPA | Uma única página, navegação por abas com estado (`useState`) | `src/App.jsx` |

**Por que Redux?** Pq mesmo dado é usado em várias telas: exemplo da receita favoritada que aparece nos Favoritos e no menu do planejador.

**Por que MUI?** Componentes prontos e mais acessíveis em um só arquivo.

## Tecnologias

- React 19 + Vite
- Redux Toolkit + react-redux
- MUI (Material UI) + Emotion
- Fontes: Fraunces (títulos) e Inter (texto), via Google Fonts

## Como rodar

Pré-requisito: Node.js 20 ou mais recente.

```bash
npm install
npm run dev
```

Abra o http://localhost:5173.

Outros comandos:

```bash
npm run build     # gera a versão de produção em dist/
npm run preview   # serve a versão de produção localmente
npm run lint      # verifica o código com ESLint
```

## Estrutura de pastas

```
src/
├── api/
│   └── mealdb.js            # todas as chamadas à TheMealDB + normalização dos dados
├── store/                   # Redux
│   ├── index.js             # configureStore + salvar/carregar do localStorage
│   ├── favoritesSlice.js    # ids das receitas favoritas
│   ├── planSlice.js         # plano da semana (ids por dia e refeição)
│   ├── mealsSlice.js        # "banco" de receitas por id + thunk fetchMealById
│   ├── shoppingSlice.js     # itens marcados como comprados
│   └── selectors.js         # dados derivados (semana, lista de compras, contadores)
├── hooks/
│   ├── useDebounce.js       # espera o usuário parar de digitar
│   ├── useMealSearch.js     # busca + filtros com useEffect e AbortController
│   ├── useMealDetails.js    # receita completa para a janela de detalhes
│   ├── useFilterOptions.js  # listas de categorias e ingredientes (com cache)
│   └── useMealDialog.js     # abrir/fechar a janela de detalhes
├── components/              # peças reutilizáveis (cards, janelas, botões)
├── pages/                   # uma por aba: Explorar, Planejador, Lista, Favoritos
├── utils/
│   ├── labels.js            # traduções e lista de origens validada
│   └── week.js              # dias da semana e refeições
├── theme.js                 # tema do MUI (identidade visual)
├── App.jsx                  # cabeçalho, abas e rodapé
└── main.jsx                 # ponto de entrada: Provider do Redux + tema
```

## Arquitetura do estado (Redux)

```
store
├── favorites   { ids: ['53220', ...] }
├── plan        { days: { mon: { lunch: '53220', dinner: null }, ... } }
├── meals       { byId: { '53220': { id, name, thumb, ingredients, ... } }, requests: {} }
└── shopping    { checked: { 'olive oil': true } }
```

Decisões principais:

1. **Estado normalizado.** Favoritos e plano guardam só ids. Os dados das receitas ficam uma única vez em `meals.byId`, mesmo que a receita esteja nos favoritos e em três dias do plano.
2. **Uma action, vários slices.** Ao favoritar (`toggleFavorite`) ou planejar (`setMeal`), o slice correspondente guarda o id e o `mealsSlice` guarda os dados da receita, via `extraReducers`.
3. **A lista de compras é derivada, não armazenada.** O seletor `selectShoppingList` (com `createSelector`) monta a lista a partir do plano. Se uma receita sai do plano, os ingredientes dela saem da lista sozinhos. O estado guarda só o que foi marcado.
4. **`createAsyncThunk` com `condition`.** Receitas vindas de filtros não têm ingredientes. A lista de compras dispara `fetchMealById` para elas, e o `condition` impede buscar de novo o que já está no cache ou carregando.
5. **Persistência tolerante a falhas.** O `localStorage` é lido e gravado dentro de `try/catch`: em aba anônima ou com dados corrompidos, o app só deixa de salvar, sem quebrar.

## Problemas da API e como foram resolvidos

- **Origens inconsistentes.** O `list.php?a=list` devolve 195 origens, mas só cerca de 30 têm receitas. Além disso, as receitas misturam nome do país com o gentílico, e `filter.php?a=Indian` volta vazio. Testando todas, o nome do país em inglês funciona sempre, então o app usa uma lista própria e validada de 44 origens (`src/utils/labels.js`).
- **Só um filtro por requisição** na versão gratuita. Para combinar filtros, o app faz uma requisição por filtro em paralelo (`Promise.all`) e mantém só as receitas presentes em todas (interseção no cliente).
- **Ingredientes "achatados"** em `strIngredient1..20` e `strMeasure1..20`, com valores vazios ou `null`. A função `normalizeMeal()` transforma em um array `[{ name, measure }]`.
- **Modo de preparo com numeração inconsistente**. A função `splitInstructions()` limpa e separa em passos.
- **Sem resultado, a API devolve `{ meals: null }`** em vez de um array vazio.
- **Medidas em texto livre**: não dá para somar com segurança, então a lista de compras agrupa e mostra juntas.
- **Ingredientes sem foto**: o componente `IngredientImage` mostra um círculo neutro no lugar da imagem quebrada.


## Uso de ferramentas de apoio (IA)


Este projeto foi desenvolvido com o apoio do **Claude (Anthropic)**, usado pelo Claude Code, em todas as etapas:

- **Planejamento**: auxílio escolha da combinação Redux + MUI, definição das funcionalidades.
- **Geração de código**: a IA foi utilizada para correção de bugs, otimização de código e lint.
- **Investigação da API**: auxílio na interpretação dos testes que revelaram as inconsistências da TheMealDB.

Dados e imagens das receitas: [TheMealDB](https://www.themealdb.com).
