# Transporte Nacional - Frontend

Interfaz de usuario para empresa transportadora de pasajeros a nivel nacional con servicios de mensajería y paquetes. Mockup completo con React + TypeScript + TailwindCSS.

## 🚀 Demo

```bash
npm run dev
# http://localhost:5174
```

## 📦 Stack

- **React 18** + **TypeScript**
- **Vite** - Build tool
- **TailwindCSS** - Styling (design system customizado)
- **Framer Motion** - Animaciones
- **React Router DOM** - Routing
- **Lucide React** - Iconos
- **clsx + tailwind-merge** - Utilidades de clases

## 🏗 Estructura

```
src/
├── components/
│   ├── ui/           # Componentes base reutilizables
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   ├── Tabs.tsx
│   │   ├── Badge.tsx
│   │   ├── Spinner.tsx
│   │   └── Tooltip.tsx
│   └── layout/       # Layout principal
│       └── Layout.tsx   # Header, Footer, MainLayout
├── pages/            # Páginas públicas
│   ├── Home.tsx
│   ├── Pasajeros.tsx      # Compra tiquetes (3 pasos)
│   ├── Envios.tsx         # Cotizar envíos (4 pasos)
│   ├── Rastreo.tsx        # Tracking con timeline
│   ├── Servicios.tsx
│   ├── Login.tsx
│   └── Demo.tsx           # Playground componentes
├── layouts/
│   └── DashboardLayout.tsx
├── pages/dashboards/
│   ├── DashboardRouter.tsx
│   ├── MisViajes.tsx
│   ├── MisEnvios.tsx
│   ├── Perfil.tsx
│   └── Configuracion.tsx
├── hooks/            # Custom hooks
│   ├── useLocalStorage.ts
│   ├── useDebounce.ts
│   ├── useMediaQuery.ts
│   └── useToggle.ts
├── utils/            # Utilidades
│   ├── cn.ts
│   ├── format.ts
│   └── constants.ts
├── types/            # TypeScript types
└── assets/
```

##  Páginas implementadas

| Página | Descripción |
|--------|-------------|
| `/` | Home con hero, búsqueda unificada, stats, features, flota, CTA |
| `/pasajeros` | Compra tiquetes: búsqueda → resultados → selección asientos |
| `/envios` | Cotizador: origen/destino → paquete → servicio → resumen/pago |
| `/rastreo` | Tracking por código, timeline animado, mapa mock, ayuda |
| `/servicios` | Grid 6 servicios con hover effects y características |
| `/login` | Auth con tabs login/register, validación, demo credentials |
| `/dashboard` | Área usuario: viajes, envíos, perfil, config (sidebar colapsible) |
| `/demo` | Playground interactivo de todos los componentes UI |

##  Design System

**Colores:**
- Brand: naranja (`#f97316`) - primaria
- Slate: escala neutra completa
- Surface: white, elevated, sunken
- Accent: sky (`#0ea5e9`)

**Tipografía:**
- Display: Space Grotesk (títulos)
- Body: DM Sans (texto)
- Mono: JetBrains Mono (código/datos)

**Tokens:** spacing, border-radius, shadows, animations, breakpoints responsive

## 🛠 Scripts

```bash
npm run dev      # Desarrollo
npm run build    # Build producción (dist/)
npm run preview  # Preview build
npm run lint     # ESLint
```

## Responsive

- Mobile-first: `< 768px`
- Tablet: `768px - 1023px`
- Desktop: `≥ 1024px`
- Sidebar colapsible en dashboard
