# LearnFlow AI — Prototipo Frontend

Prototipo de **simulación de flujo, exclusivamente frontend**, de una plataforma de
aprendizaje personalizado con IA. **No hay backend, base de datos, ni LLM reales**: todo se
simula en el navegador con datos mock, estado en memoria (Zustand) y `localStorage`.

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS
- React Router
- Zustand (estado global + persistencia en `localStorage`)
- Recharts (gráficas) · lucide-react (iconos)

## Cómo ejecutar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de producción
npm run preview  # previsualizar el build
```

## Cómo se simula el "backend"

| Concepto real            | Simulación en este prototipo                                  |
| ------------------------ | ------------------------------------------------------------- |
| Base de datos            | `src/lib/storage.ts` (wrapper `db.get/set/update` sobre `localStorage`) + store Zustand persistido |
| Motor de IA / LLM        | `src/lib/mockAI.ts` (lógica determinista que filtra los mocks) |
| Operaciones asíncronas   | `src/lib/fakeAsync.ts` (Promise con delay de 0.8–1.5 s + loaders) |
| Autenticación            | Validación de formato + comparación contra `localStorage` (sin hashing/JWT real) |
| Envío de correos / código| Se muestran en pantalla/toast                                  |
| WebSocket / tiempo real  | Actualización directa del estado global                       |

## Estructura

```
src/
  app/            layout, router guards
  components/      UI reutilizable (Button, Card, Modal, Toaster…)
  data/           MOCKS (skills, modules, questions, resources, badges…)
  features/       una carpeta por módulo funcional (RF-01…RF-10)
  lib/            storage, fakeAsync, mockAI, gamification
  store/          Zustand store + selectores + toasts
  types/          tipados de dominio
```

## Módulos funcionales

- **RF-01 Auth** · registro, login, recuperación, logout
- **RF-02 Perfil** · wizard inicial, edición, eliminación de cuenta
- **RF-03 Diagnóstico** · cuestionario, resultados (radar), brechas, repetición
- **RF-04 Rutas** · generación rápida/completa, detalle de módulo
- **RF-05 Recomendaciones + Asistente IA** · sugerencias y chat por keywords
- **RF-06 Actividades** · repaso, ejercicios, retos, prueba corta
- **RF-07 Progreso** · dashboard, por habilidad, historial, resumen semanal
- **RF-08 Productividad** · pomodoro, disponibilidad, recordatorios, calendario
- **RF-09 Gamificación** · metas, insignias, certificado, motivación, satisfacción
- **RF-10 Explorar** · búsqueda, filtros, favoritos, preferencias

## Flujo "feliz" demostrable

Registro → Configuración de perfil → Diagnóstico → Generación de ruta → Panel principal →
Completar un módulo con actividades → Ver progreso → Obtener una insignia →
Generar certificado al completar la ruta.

Todo el estado persiste en `localStorage`: si recargas a mitad del flujo, continúas donde estabas.
