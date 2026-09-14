-- Papéis de usuário
create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- Configuração de horários semanais (linha única)
create table public.business_settings (
  id int primary key default 1 check (id = 1),
  weekly_hours jsonb not null default '[{"weekday":0,"closed":true,"start":"09:00","end":"18:00"},{"weekday":1,"closed":true,"start":"09:00","end":"18:00"},{"weekday":2,"closed":false,"start":"09:00","end":"18:00"},{"weekday":3,"closed":false,"start":"09:00","end":"18:00"},{"weekday":4,"closed":false,"start":"09:00","end":"18:00"},{"weekday":5,"closed":false,"start":"09:00","end":"18:00"},{"weekday":6,"closed":false,"start":"09:00","end":"18:00"}]'::jsonb,
  updated_at timestamptz not null default now()
);

-- Bloqueios pontuais (dias fechados ou faixas de horário)
create table public.schedule_blocks (
  id uuid primary key default gen_random_uuid(),
  block_date date not null,
  full_day boolean not null default true,
  start_time text,
  end_time text,
  note text,
  created_at timestamptz not null default now()
);

grant select on public.business_settings to anon;
grant select, insert, update, delete on public.business_settings to authenticated;
grant all on public.business_settings to service_role;
grant select on public.schedule_blocks to anon;
grant select, insert, update, delete on public.schedule_blocks to authenticated;
grant all on public.schedule_blocks to service_role;

alter table public.business_settings enable row level security;
alter table public.schedule_blocks enable row level security;

create policy "Público pode ler horários"
  on public.business_settings for select
  to anon, authenticated
  using (true);

create policy "Admin lê horários"
  on public.business_settings for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admin atualiza horários"
  on public.business_settings for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admin insere horários"
  on public.business_settings for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Público pode ler bloqueios"
  on public.schedule_blocks for select
  to anon, authenticated
  using (true);

create policy "Admin gerencia bloqueios"
  on public.schedule_blocks for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

insert into public.business_settings (id) values (1) on conflict (id) do nothing;