# Menu CMS

Painel administrativo (CMS) do Cardápio Digital. A equipe do restaurante usa a aplicação para cadastrar categorias, produtos e mesas, acompanhar as comandas em aberto e controlar o status dos pedidos. Tudo vem da API NestJS desenvolvida no primeiro bimestre (`menu-backend`), sem nenhum dado fixo no código.

## Funcionalidades

| Área | O que faz |
|---|---|
| Categorias | Listar (ícone, nome e situação), cadastrar, editar e excluir com confirmação |
| Produtos | Listar (imagem, nome, categoria, preço em reais e situação), cadastrar, editar e excluir com confirmação. O menu lateral de categorias filtra a lista |
| Mesas | Listar, cadastrar, editar e excluir com confirmação |
| Comandas | Lista só as comandas abertas (mesa, data de abertura, quantidade de pedidos e total). O botão "Ver pedidos" abre os pedidos da comanda |
| Pedidos | Mostra os itens, o total e o status de cada pedido, e permite trocar o status (Novo, Em preparo, Pronto, Entregue) |
| Kanban (bônus) | Página "Pedidos" com uma coluna por status. Ao arrastar o card para outra coluna, o status é gravado na API |

Todas as telas de leitura tratam os estados de carregamento, erro (com botão "Tentar de novo") e lista vazia. Cada cadastro, edição, exclusão e troca de status mostra um aviso (toast) de sucesso ou erro, e os formulários validam os campos antes de enviar.

## Tecnologias

Stack obrigatória da atividade:

- **Vite** e **React** (com TypeScript)
- **Tailwind CSS**
- **shadcn/ui**
- **Axios**: uma única instância (`src/lib/axios.ts`), com a `baseURL` lida de `VITE_API_URL`. Nenhuma URL da API aparece nos componentes
- **TanStack Query**: leituras com `useQuery` e gravações com `useMutation`, invalidando as consultas afetadas (`invalidateQueries`) depois do sucesso

## Dependências fora da stack obrigatória

| Dependência | Justificativa |
|---|---|
| `react-router-dom` | Navegação entre as áreas do CMS (Categorias, Produtos, Mesas, Comandas e Pedidos) e a categoria selecionada no filtro de produtos, que fica na URL (`/produtos?categoryId=...`) |
| `sonner` | Avisos de sucesso e erro depois de cada gravação. É a biblioteca de toast usada pelo shadcn/ui |
| `@fontsource-variable/inter` e `@fontsource-variable/roboto-condensed` | Fontes do visual do cardápio (o CMS segue o mesmo design do `menu-frontend`) |

Dependências de apoio da própria stack, instaladas com o shadcn/ui e o Tailwind: `@base-ui/react`, `class-variance-authority`, `cn`, `lucide-react` (ícones), `next-themes`, `shadcn`, `tw-animate-css` e `@tailwindcss/vite`.

O arrastar e soltar do Kanban usa o recurso nativo do navegador (HTML5 Drag and Drop), por isso nenhuma biblioteca de drag and drop foi adicionada.

## Como executar

Requisitos: Node.js 20.19 ou superior (desenvolvido com Node 24) e o backend em execução.

1. Suba o backend (`menu-backend`) seguindo as instruções do repositório dele: https://github.com/marianaSsouza/menu-backend.git
2. Clone e instale o CMS:

```bash
git clone https://github.com/marianaSsouza/menu-cms.git
cd menu-cms
npm install
```

3. Crie o arquivo `.env` a partir do exemplo e confira o endereço da API:

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:3000
```

4. Rode o projeto:

```bash
npm run dev
```

Scripts disponíveis: `npm run dev` (desenvolvimento), `npm run build` (build de produção), `npm run lint` e `npm run preview`.

## API utilizada

| Recurso | Rotas usadas |
|---|---|
| Categorias | `GET /categories`, `POST /categories`, `PATCH /categories/:id`, `DELETE /categories/:id` |
| Produtos | `GET /products` (com `?categoryId=` para filtrar), `POST /products`, `PATCH /products/:id`, `DELETE /products/:id` |
| Mesas | `GET /spots`, `POST /spots`, `PATCH /spots/:id`, `DELETE /spots/:id` |
| Comandas | `GET /guest-checks?status=OPENED` |
| Pedidos | `GET /orders`, `PATCH /orders/:id/status` |

### Ajustes feitos na API

Para o CMS funcionar, o `menu-backend` recebeu três ajustes:

1. **Nova rota `GET /guest-checks`**, com filtro opcional `?status=` (por exemplo, `OPENED`). Devolve as comandas já com a mesa. Arquivos: `guest-check.controller.ts` e `guest-check.service.ts`.
2. **`GET /orders` passou a carregar as relações**: a comanda (com a mesa) e os itens (com o produto). Antes devolvia só os dados do pedido. Arquivo: `order.service.ts`.
3. **`PATCH /orders/:id/status` com transição livre**: qualquer status pode ir para qualquer outro, como pede a atividade. A condição anterior retornava erro para qualquer status. Arquivo: `order.service.ts`.

## Decisões técnicas

- **Filtro de produtos no backend.** A categoria escolhida no menu lateral vai na URL e na `queryKey` (`['products', categoryId]`). O back filtra com `?categoryId=`, e cada categoria tem o próprio cache no TanStack Query.
- **Invalidação do cache.** Toda gravação invalida as consultas afetadas. Editar ou excluir uma categoria invalida também `products`, porque cada produto traz a categoria aninhada, e sem isso a lista de produtos ficaria com o nome antigo.
- **Formulário recriado a cada abertura.** As páginas mudam a `key` do formulário toda vez que ele abre. Assim o estado já nasce com os dados do item (ou vazio, no cadastro), sem `useEffect` para copiar valores.
- **Preço.** O banco devolve o preço como texto (`"36.90"`). A interface converte com `Number()` e formata em reais com `Intl.NumberFormat`. No envio, o valor vai como número com duas casas.
- **Total da comanda calculado no front.** A API não devolve o total da comanda, então a página soma o total dos pedidos de cada comanda.
- **Kanban com atualização otimista.** O `useMutation` move o card na hora (`onMutate`), grava o novo status na API e, se a API recusar, devolve o card para a coluna de origem (`onError`). No fim, a consulta é refeita (`onSettled`), então o que fica na tela é o que está salvo no banco.

## Limitações

- A API não tem **ordem de exibição** nas categorias nem os indicadores **vegetariano** e **novidade** nos produtos, então o CMS não exibe esses campos.
- `GET /products` devolve só produtos **ativos** (comportamento pensado para o cardápio do cliente). Por isso, um produto marcado como inativo deixa de aparecer na lista do CMS.
- O arrastar e soltar do Kanban funciona com mouse. O recurso nativo do navegador não funciona com toque em telas de celular.

## Estrutura do projeto

```
src/
├── cases/
│   ├── categories/    dtos, services, hooks e components
│   ├── products/      dtos, services, hooks e components
│   ├── spots/         dtos, services, hooks e components
│   ├── guest-checks/  dtos, services, hooks e components
│   └── orders/        dtos, services, hooks e components (inclui o Kanban)
├── pages/             uma página por área do CMS
├── components/
│   ├── Layout/        cabeçalho e layout geral
│   └── ui/            componentes do shadcn/ui
└── lib/               instância do Axios e funções de formatação
```
