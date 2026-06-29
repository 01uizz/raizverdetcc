# Iracambi Raiz Verde — Plataforma de Transparência Ambiental

Site da ONG Iracambi (Associação Amigos de Iracambi): reflorestamento da Mata
Atlântica em Rosário da Limeira/MG, unindo ciência, conservação e comunidade.

> **Status desta entrega:** primeira iteração da reforma. Resolve os problemas
> nomeados (painel em branco, fluxo de doação, mapa, transparência) + bugs
> críticos de lógica + fundação de design e de backend. Veja o **Roteiro** ao
> final para o que ainda falta (polimento visual página a página, etc.).

---

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Supabase** (`@supabase/ssr` + `supabase-js`): Auth, Postgres, Storage
- **Tailwind CSS 3** (design tokens em `tailwind.config.js`)
- **Leaflet** (mapa), **lucide-react** (ícones), **date-fns**

## Estrutura

```
src/
  app/            rotas (App Router). Inclui boundaries error/loading/not-found
    admin/        painel administrativo (CRUD de projetos, doações, etc.)
    areas/[id]/   página PÚBLICA de transparência de cada projeto
    mapa/         mapa interativo público
    painel/ ...   área do doador (login)
  components/
    home/         seções da landing
    donate/       fluxo de doação PIX (StepAuth → StepPix → StepConfirm)
    map/          MapView (Leaflet) robusto
    ui/           primitivos reutilizáveis (Card, Button, Badge, Section,
                  EmptyState, ErrorState, Skeleton, ProgressBar, Spinner…)
  context/        AuthContext
  hooks/          useAreas, useStats, useReports, useUpdates
  services/       camada de acesso ao Supabase (areas, donations, reports, auth)
supabase/
  schema.sql      tabelas + RLS + trigger + storage  ← rode no Supabase
```

## Como rodar

```bash
npm install
cp .env.example .env.local   # preencha as chaves do Supabase e do PIX
npm run dev                  # http://localhost:3000
```

> Esta entrega **não pôde ser compilada/testada** no ambiente de origem (sem
> acesso à rede para `npm install` / `next build` / Supabase). Rode localmente
> para validar o build e ajustar o que for necessário.

### Banco de dados
1. No Supabase, abra **SQL Editor** e rode `supabase/schema.sql`.
2. Crie seu usuário pelo site (`/register`) e depois promova-o a admin:
   ```sql
   update public.profiles set tipo = 'admin'
   where id = (select id from auth.users where email = 'voce@iracambi.com');
   ```
3. Faça login em `/admin`.

---

## O que mudou nesta reforma

### Correções de lógica (críticas)
- **Cadastro quebrado:** `signUp` era chamado com a assinatura errada — o nome
  virava metadado solto e o tipo era descartado. Agora os metadados vão como
  objeto (`{ nome }`) e o **tipo é sempre `doador`** (definido no serviço).
- **Escalonamento de privilégio:** removida a opção de se cadastrar como *admin*
  pela tela de registro. Admin só no banco (ver SQL).
- **Convenção única `doador`/`admin`** em todo o projeto (antes misturava
  `donor`/`doador`).
- **Estatísticas erradas:** `useStats` consultava a tabela inexistente
  `updates` (correto: `area_updates`) e tinha arrecadação fixa em 0. Agora lê a
  tabela certa e calcula arrecadação a partir das doações confirmadas.

### Painel admin "em branco"
Causa-raiz: não havia **nenhum** boundary de erro/carregamento — qualquer erro
de runtime renderizava tela vazia, e o layout fazia `return null` durante a
verificação de auth. Corrigido com `error.tsx`, `loading.tsx`, `not-found.tsx`,
`global-error.tsx` (globais e no `/admin`), um `/admin` que decide o destino no
cliente e um layout que mostra estados em vez de vazio.

### Fluxo de doação
Unificado e honesto: por padrão **doar como convidado** (nome + e-mail só para
comprovante, **sem criar conta**); quem já tem conta pode entrar para acompanhar
no painel. Acabou a criação de "conta fantasma" com senha aleatória. **Toda
doação é registrada** em `doacoes` como `pendente` e conciliada no painel.

### Mapa robusto
`MapView` reescrito com estados explícitos (carregando/pronto/erro), **timeout
de 12s**, botão de **tentar novamente**, fallback visual e fim do polling
frágil que causava carregamento infinito.

### Transparência real ("Onde seu dinheiro vai")
- Página `/areas/[id]` agora é **pública** (antes exigia login) e mostra dados
  reais: objetivo, meta, progresso calculado (mudas plantadas ÷ meta),
  espécies, **relatórios** e timeline de atualizações.
- Removidas as barras de progresso **inventadas** (65%/30% fixos) da home.
- Admin cadastra objetivo, meta de mudas e capa em **Projetos**.

### Design
Tokens elevados (paleta floresta + terra/ciência, sombras `forest`, animações
sutis, fonte display **Fraunces**), acessibilidade (`focus-visible`,
`prefers-reduced-motion`), `container-page`, skeletons e primitivos de UI
reutilizáveis.

### Segurança / organização
- `.gitignore` adicionado; segredos saem para `.env.local` (PIX e Supabase em
  variáveis de ambiente — chave PIX pessoal não fica mais no código).
- RLS completo no `schema.sql` (leitura pública de projetos; escrita só admin;
  doação `insert` anônima limitada a `pendente`).

---

## Limitação conhecida — PIX

O gerador de payload PIX (`StepPix`) assume **chave do tipo telefone** (`+55…`).
Se a ONG usar **CNPJ ou e-mail** como chave, o builder EMV precisa ser ajustado
para esse formato. Além disso, PIX estático **não confirma pagamento
automaticamente** — por isso as doações entram como `pendente` e são confirmadas
manualmente no painel. Para confirmação automática, integrar um gateway
(Mercado Pago, Asaas, PagBank) com webhook que atualize o status.

---

## Roteiro

### Concluído nesta iteração
- ✅ **Polimento visual da home** (Hero, Stats, Carousel, Donate, Footer) com a
  fonte display, profundidade e animações de entrada.
- ✅ **Responsividade da área do doador e do admin:** sidebars viraram drawer no
  mobile (`md:ml-64` + barra superior com menu). Layouts do doador unificados
  num único `DonorShell`.
- ✅ **Admin → Relatórios:** tela `/admin/relatorios` para publicar/excluir
  relatórios por projeto, com upload ao Storage. Aparecem na página pública.

### Ainda em aberto
1. **Admin → Atualizações:** a tela `/admin/update` já cria `area_updates` com
   foto; falta uma listagem/edição/exclusão dedicada (a base já existe).
2. **Usuários (admin):** a tela usa e-mail simulado (`setTimeout`); integrar um
   envio real (ex.: Supabase Edge Function) ou remover a ação.
3. **Gateway de pagamento** para confirmar doações automaticamente (webhook que
   atualize o status de `pendente` → `pago`).
4. **SSR/ISR** nas páginas públicas (hoje tudo é `'use client'`), `strict: true`
   no TypeScript, e revisar a dependência `iceberg-js` presente em
   `node_modules` mas fora do `package.json`.
5. **Auditar as policies RLS** no ambiente real após rodar o `schema.sql`.
