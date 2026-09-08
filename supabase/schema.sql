-- =========================================================
-- SCHEMA: Plataforma de Arqueros
-- Correr este archivo completo en Supabase > SQL Editor
-- ---------------------------------------------------------
-- 0. LIMPIEZA (permite re-correr este script sin errores,
--    sin importar si es la primera vez o no)
-- ---------------------------------------------------------
do $$
begin
  if to_regclass('public.profiles') is not null then
    drop policy if exists "profiles: ver propio perfil" on public.profiles;
    drop policy if exists "profiles: profesor ve todos" on public.profiles;
    drop policy if exists "profiles: actualizar propio perfil" on public.profiles;
  end if;

  if to_regclass('public.entrenamientos') is not null then
    drop policy if exists "entrenamientos: alumno ve los suyos" on public.entrenamientos;
    drop policy if exists "entrenamientos: profesor gestiona todo" on public.entrenamientos;
  end if;

  if to_regclass('public.entrenamiento_archivos') is not null then
    drop policy if exists "archivos: alumno ve los suyos" on public.entrenamiento_archivos;
    drop policy if exists "archivos: profesor gestiona todo" on public.entrenamiento_archivos;
  end if;

  if to_regclass('public.estadisticas') is not null then
    drop policy if exists "estadisticas: alumno ve las suyas" on public.estadisticas;
    drop policy if exists "estadisticas: profesor gestiona todo" on public.estadisticas;
  end if;

  if to_regclass('storage.objects') is not null then
    drop policy if exists "storage: profesor sube archivos" on storage.objects;
    drop policy if exists "storage: profesor gestiona archivos" on storage.objects;
    drop policy if exists "storage: alumno ve sus archivos" on storage.objects;
  end if;
end $$;

drop trigger if exists on_auth_user_created on auth.users;

-- ---------------------------------------------------------
-- 1. PROFILES
-- Extiende auth.users con datos propios de la app (rol, nombre).
-- Se crea automáticamente cuando alguien se registra (ver trigger al final).
-- ---------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'alumno' check (role in ('alumno', 'profesor')),
  nombre_completo text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Función helper: ¿el usuario actual es profesor?
create or replace function public.is_profesor()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'profesor'
  );
$$;

-- Cualquier usuario logueado puede ver su propio perfil.
create policy "profiles: ver propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

-- El profesor puede ver los perfiles de sus alumnos.
create policy "profiles: profesor ve todos"
  on public.profiles for select
  using (public.is_profesor());

-- Cada usuario puede actualizar su propio perfil.
create policy "profiles: actualizar propio perfil"
  on public.profiles for update
  using (auth.uid() = id);


-- ---------------------------------------------------------
-- 2. ENTRENAMIENTOS
-- Contenido que el profesor sube por cada clase de un alumno.
-- ---------------------------------------------------------
create table if not exists public.entrenamientos (
  id uuid primary key default gen_random_uuid(),
  alumno_id uuid not null references public.profiles(id) on delete cascade,
  profesor_id uuid not null references public.profiles(id) on delete cascade,
  titulo text not null,
  descripcion text,
  fecha date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.entrenamientos enable row level security;

-- El alumno ve solo sus propios entrenamientos.
create policy "entrenamientos: alumno ve los suyos"
  on public.entrenamientos for select
  using (auth.uid() = alumno_id);

-- El profesor ve, crea, edita y borra todos.
create policy "entrenamientos: profesor gestiona todo"
  on public.entrenamientos for all
  using (public.is_profesor())
  with check (public.is_profesor());


-- ---------------------------------------------------------
-- 3. ENTRENAMIENTO_ARCHIVOS
-- Videos, fotos o notas asociados a un entrenamiento (1 a muchos).
-- ---------------------------------------------------------
create table if not exists public.entrenamiento_archivos (
  id uuid primary key default gen_random_uuid(),
  entrenamiento_id uuid not null references public.entrenamientos(id) on delete cascade,
  tipo text not null check (tipo in ('video', 'foto', 'nota')),
  url text,               -- para video/foto (ruta en Supabase Storage)
  contenido_texto text,   -- para notas
  created_at timestamptz not null default now()
);

alter table public.entrenamiento_archivos enable row level security;

-- El alumno ve los archivos de SUS entrenamientos (vía join).
create policy "archivos: alumno ve los suyos"
  on public.entrenamiento_archivos for select
  using (
    exists (
      select 1 from public.entrenamientos e
      where e.id = entrenamiento_id and e.alumno_id = auth.uid()
    )
  );

-- El profesor gestiona todos los archivos.
create policy "archivos: profesor gestiona todo"
  on public.entrenamiento_archivos for all
  using (public.is_profesor())
  with check (public.is_profesor());


-- ---------------------------------------------------------
-- 4. ESTADISTICAS
-- Seguimiento de rendimiento del arquero, opcionalmente ligado a un entrenamiento.
-- ---------------------------------------------------------
create table if not exists public.estadisticas (
  id uuid primary key default gen_random_uuid(),
  alumno_id uuid not null references public.profiles(id) on delete cascade,
  entrenamiento_id uuid references public.entrenamientos(id) on delete set null,
  fecha date not null default current_date,
  atajadas int default 0,
  goles_recibidos int default 0,
  saques_exitosos int default 0,
  salidas_exitosas int default 0,
  minutos_jugados int default 0,
  notas text,
  creado_por uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

alter table public.estadisticas enable row level security;

create policy "estadisticas: alumno ve las suyas"
  on public.estadisticas for select
  using (auth.uid() = alumno_id);

create policy "estadisticas: profesor gestiona todo"
  on public.estadisticas for all
  using (public.is_profesor())
  with check (public.is_profesor());


-- ---------------------------------------------------------
-- 5. TRIGGER: crear perfil automáticamente al registrarse
-- Lee "nombre_completo" y "role" de los metadatos pasados en el signUp().
-- ---------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nombre_completo, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre_completo', 'Sin nombre'),
    coalesce(new.raw_user_meta_data->>'role', 'alumno')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ---------------------------------------------------------
-- 6. STORAGE: bucket para videos y fotos de entrenamientos
-- ---------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('entrenamientos', 'entrenamientos', false)
on conflict (id) do nothing;

create policy "storage: profesor sube archivos"
  on storage.objects for insert
  with check (bucket_id = 'entrenamientos' and public.is_profesor());

create policy "storage: profesor gestiona archivos"
  on storage.objects for all
  using (bucket_id = 'entrenamientos' and public.is_profesor());

create policy "storage: alumno ve sus archivos"
  on storage.objects for select
  using (
    bucket_id = 'entrenamientos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
