-- =====================================================================
-- Iracambi Raiz Verde — Esquema do Supabase (Postgres)
-- Rode no SQL Editor do Supabase. É idempotente: pode rodar mais de uma vez.
-- =====================================================================

-- ──────────────────────────────────────────────────────────────────
-- 1) PROFILES  (perfil do usuário, espelha auth.users)
--    tipo: 'doador' | 'admin'  — admin é definido SOMENTE aqui (nunca pela UI)
-- ──────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  nome       text,
  tipo       text not null default 'doador' check (tipo in ('doador','admin')),
  created_at timestamptz not null default now()
);

-- Cria o profile automaticamente quando um usuário se cadastra.
-- O nome vem dos metadados; o tipo entra sempre como 'doador'.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nome, tipo)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', ''), 'doador')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Função auxiliar: o usuário atual é admin? (evita recursão de RLS)
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.tipo = 'admin'
  );
$$;

-- ──────────────────────────────────────────────────────────────────
-- 2) AREAS / PROJETOS  (+ campos de transparência)
-- ──────────────────────────────────────────────────────────────────
create table if not exists public.areas (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  descricao   text,
  status      text not null default 'ativo',
  tamanho     numeric,
  geojson     jsonb,
  created_at  timestamptz not null default now()
);

-- Colunas novas exigidas pela reforma (transparência)
alter table public.areas add column if not exists objetivo     text;
alter table public.areas add column if not exists meta_arvores integer;
alter table public.areas add column if not exists meta_valor   numeric;
alter table public.areas add column if not exists capa_url     text;
alter table public.areas add column if not exists updated_at   timestamptz default now();

-- ──────────────────────────────────────────────────────────────────
-- 3) AREA_UPDATES  (atualizações/timeline de cada projeto)
-- ──────────────────────────────────────────────────────────────────
create table if not exists public.area_updates (
  id          uuid primary key default gen_random_uuid(),
  area_id     uuid not null references public.areas(id) on delete cascade,
  data        date not null default current_date,
  arvores     integer default 0,
  especies    text[] default '{}',
  observacao  text,
  status      text,
  foto_url    text,
  created_by  uuid references auth.users(id),
  created_at  timestamptz not null default now()
);
create index if not exists idx_area_updates_area on public.area_updates(area_id);

-- ──────────────────────────────────────────────────────────────────
-- 4) AREA_REPORTS  (relatórios de transparência — PDFs, links, marcos)
-- ──────────────────────────────────────────────────────────────────
create table if not exists public.area_reports (
  id          uuid primary key default gen_random_uuid(),
  area_id     uuid not null references public.areas(id) on delete cascade,
  titulo      text not null,
  data        date,
  arquivo_url text,
  created_at  timestamptz not null default now()
);
create index if not exists idx_area_reports_area on public.area_reports(area_id);

-- ──────────────────────────────────────────────────────────────────
-- 5) DOACOES  (registro real de doações)
--    status: 'pendente' | 'confirmado' | 'pago' | 'cancelado'
-- ──────────────────────────────────────────────────────────────────
create table if not exists public.doacoes (
  id          uuid primary key default gen_random_uuid(),
  valor       numeric not null check (valor >= 0),
  status      text not null default 'pendente'
              check (status in ('pendente','confirmado','pago','cancelado')),
  nome        text,
  email       text,
  user_id     uuid references auth.users(id) on delete set null,
  area_id     uuid references public.areas(id) on delete set null,
  created_at  timestamptz not null default now()
);
create index if not exists idx_doacoes_status on public.doacoes(status);

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
alter table public.profiles     enable row level security;
alter table public.areas        enable row level security;
alter table public.area_updates enable row level security;
alter table public.area_reports enable row level security;
alter table public.doacoes      enable row level security;

-- PROFILES: cada um lê/edita o próprio; admin lê/edita todos.
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using (auth.uid() = id or public.is_admin());
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (auth.uid() = id or public.is_admin());

-- AREAS / UPDATES / REPORTS: leitura PÚBLICA; escrita só admin.
drop policy if exists areas_public_read on public.areas;
create policy areas_public_read on public.areas for select using (true);
drop policy if exists areas_admin_write on public.areas;
create policy areas_admin_write on public.areas for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists updates_public_read on public.area_updates;
create policy updates_public_read on public.area_updates for select using (true);
drop policy if exists updates_admin_write on public.area_updates;
create policy updates_admin_write on public.area_updates for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists reports_public_read on public.area_reports;
create policy reports_public_read on public.area_reports for select using (true);
drop policy if exists reports_admin_write on public.area_reports;
create policy reports_admin_write on public.area_reports for all
  using (public.is_admin()) with check (public.is_admin());

-- DOACOES: qualquer visitante pode CRIAR (anon) uma doação pendente.
--          Leitura/edição apenas do admin (ou o próprio doador logado vê as suas).
drop policy if exists doacoes_public_insert on public.doacoes;
create policy doacoes_public_insert on public.doacoes
  for insert with check (
    status = 'pendente'                 -- visitante nunca cria já "confirmado"
    and (user_id is null or user_id = auth.uid())
  );
drop policy if exists doacoes_select on public.doacoes;
create policy doacoes_select on public.doacoes
  for select using (public.is_admin() or user_id = auth.uid());
drop policy if exists doacoes_admin_update on public.doacoes;
create policy doacoes_admin_update on public.doacoes
  for update using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- STORAGE: bucket público para fotos/relatórios de projetos
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('area-photos', 'area-photos', true)
on conflict (id) do nothing;

drop policy if exists area_photos_public_read on storage.objects;
create policy area_photos_public_read on storage.objects
  for select using (bucket_id = 'area-photos');
drop policy if exists area_photos_admin_write on storage.objects;
create policy area_photos_admin_write on storage.objects
  for insert with check (bucket_id = 'area-photos' and public.is_admin());

-- =====================================================================
-- COMO PROMOVER UM ADMIN (rode manualmente, troque o e-mail):
--
--   update public.profiles set tipo = 'admin'
--   where id = (select id from auth.users where email = 'voce@iracambi.com');
--
-- Não existe forma de virar admin pela interface — é intencional (segurança).
-- =====================================================================
