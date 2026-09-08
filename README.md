# Arqueros — Plataforma de seguimiento de rendimiento

App para que arqueros (alumnos) y entrenadores (profesores) registren
entrenamientos y estadísticas de rendimiento.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Supabase**: base de datos Postgres, Auth y Storage (archivos de entrenamientos)
- Web responsive, lista para instalarse como PWA en el celular

## Cómo arrancar

1. **Crear proyecto en [supabase.com](https://supabase.com)**.
2. Ir a *SQL Editor* en el panel de Supabase, pegar y correr todo el contenido
   de `supabase/schema.sql`. Esto crea las tablas, los roles y las políticas
   de seguridad (RLS).
3. Copiar `.env.example` a `.env.local` y completar con los datos de
   *Project Settings > API* de tu proyecto Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
4. Instalar dependencias y levantar el proyecto:
   ```
   npm install
   npm run dev
   ```
5. Entrar a `http://localhost:3000`, crear una cuenta como "Entrenador" y
   otra como "Arquero" para probar los dos roles.

**Pendiente antes de producción:** agregar los íconos `icon-192.png` y
`icon-512.png` en `/public` (están referenciados en `manifest.json` pero
todavía no existen).

## Arquitectura (Screaming Architecture)

Las carpetas están organizadas por **funcionalidad del negocio**, no por tipo
técnico. Así, con solo mirar `src/features/`, se entiende qué hace la app:

```
src/
├── app/                    → rutas de Next.js (páginas). Livianas: arman
│                              la página juntando piezas de features/.
│
├── features/
│   ├── auth/                → login, registro, logout
│   │   ├── actions/            server actions (login, signup, logout)
│   │   └── components/         LoginForm, RegisterForm
│   │
│   ├── arqueros/            → datos del perfil del arquero
│   │   └── actions/            getPerfil
│   │
│   ├── entrenamientos/      → contenido subido por el profesor por clase
│   │   ├── actions/            getEntrenamientos
│   │   └── components/         EntrenamientoCard
│   │
│   ├── estadisticas/        → seguimiento de rendimiento
│   │   ├── actions/            getEstadisticas
│   │   └── components/         EstadisticasResumen
│   │
│   └── admin/                → todo lo que usa el profesor para gestionar
│       ├── actions/            getAlumnos
│       └── components/         ListaAlumnos
│
├── shared/                  → SOLO lo genérico y reutilizable en toda la app
│   └── components/             Button, Input, AppHeader
│
└── lib/
    └── supabase/             → conexión con Supabase
        ├── client.ts            cliente para Client Components (navegador)
        ├── server.ts            cliente para Server Components/Actions
        ├── middleware.ts        refresca la sesión en cada request
        └── types.ts             tipos que reflejan las tablas de la base
```

**Regla simple para el futuro:** si algo es específico de una funcionalidad
(ej: una tarjeta que solo se usa para mostrar estadísticas), va dentro de
`features/estadisticas/`. Si se reutiliza en 2 o más features sin cambios
(ej: un botón), va en `shared/`.

## Roles y seguridad

La seguridad no depende solo del código de la app: está reforzada a nivel de
base de datos con **Row Level Security (RLS)** en `supabase/schema.sql`. Un
alumno solo puede leer sus propios entrenamientos/estadísticas aunque alguien
intente manipular las consultas desde el navegador.

- `alumno`: ve sus propios entrenamientos y estadísticas.
- `profesor`: ve y gestiona todos los alumnos, entrenamientos y estadísticas.

## Próximos pasos sugeridos (no incluidos en esta v1)

- Formulario para que el profesor cree entrenamientos y suba archivos.
- Formulario para que el profesor cargue estadísticas.
- Página de detalle de un alumno (`/admin/alumnos/[id]`).
- Íconos reales para el manifest / PWA instalable.
