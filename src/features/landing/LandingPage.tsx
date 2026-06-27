import { Link } from 'react-router-dom';
import {
  GraduationCap,
  BookOpen,
  Brain,
  BarChart3,
  Zap,
  Star,
  Check,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  Target,
  Lightbulb,
} from 'lucide-react';
import { useState, useEffect } from 'react';

/* ------------------------------------------------------------------ */
/*  Landing Page                                                       */
/* ------------------------------------------------------------------ */
export function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      {/* ── Navbar ── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link to="/landing" className="flex items-center gap-2.5 group">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-500/25 transition-transform group-hover:scale-105">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-extrabold text-slate-900">LearnFlow</span>
              <span className="ml-1 text-lg font-extrabold bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
                AI
              </span>
            </div>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#nosotros" className="text-sm font-medium text-slate-600 transition hover:text-brand-600">
              Nosotros
            </a>
            <a href="#caracteristicas" className="text-sm font-medium text-slate-600 transition hover:text-brand-600">
              Características
            </a>
            <a href="#precios" className="text-sm font-medium text-slate-600 transition hover:text-brand-600">
              Precios
            </a>
          </nav>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            Iniciar Sesión
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-brand-100/60 to-brand-200/30 blur-3xl" />
          <div className="absolute -bottom-60 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-violet-100/40 to-blue-100/30 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-gradient-radial from-brand-50/50 to-transparent blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200/60 bg-brand-50/80 px-4 py-1.5 text-xs font-semibold text-brand-700 shadow-sm backdrop-blur-sm mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Potenciado por Inteligencia Artificial
          </div>
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Aprende más rápido con un tutor
            <span className="bg-gradient-to-r from-brand-500 via-brand-600 to-violet-600 bg-clip-text text-transparent">
              {' '}inteligente y personalizado
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-500 sm:text-xl">
            LearnFlow AI se adapta a tu ritmo, tus habilidades y tus metas. Convierte cualquier PDF
            en un curso interactivo y estudia con un asistente que entiende exactamente lo que
            necesitas.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-brand-500/25 transition-all hover:shadow-2xl hover:shadow-brand-500/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              Comenzar gratis
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#nosotros"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-400 hover:-translate-y-0.5"
            >
              Descubre más
            </a>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-6 sm:gap-8">
            {[
              { value: 'IA Avanzada', label: 'Tutor personalizado' },
              { value: '100%', label: 'Adaptativo' },
              { value: '24/7', label: 'Disponibilidad' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-extrabold bg-gradient-to-r from-brand-600 to-violet-600 bg-clip-text text-transparent sm:text-3xl">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Nosotros ── */}
      <section id="nosotros" className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              <Target className="h-3.5 w-3.5" />
              Nuestra Misión
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Cambiamos la manera en que el mundo estudia
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
              Creemos que cada persona aprende de forma diferente. Por eso creamos un sistema que se
              ajusta a ti, no al revés.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {/* Card misión */}
            <div className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:shadow-brand-100/50 hover:-translate-y-1">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-brand-100 to-brand-50 opacity-60 transition-transform group-hover:scale-150" />
              <div className="relative">
                <div className="mb-5 inline-flex rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-3.5 text-white shadow-lg shadow-brand-500/20">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Nuestra Misión</h3>
                <p className="mt-3 leading-relaxed text-slate-500">
                  Nuestra misión consiste en cambiar la manera en que el mundo estudia, ofreciendo un
                  sistema integral que funcione como un{' '}
                  <strong className="text-slate-700">tutor inteligente y personalizado</strong>. Queremos
                  que cada estudiante tenga acceso a una experiencia de aprendizaje diseñada
                  específicamente para sus necesidades, sin importar dónde se encuentre.
                </p>
              </div>
            </div>

            {/* Card objetivo */}
            <div className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:shadow-violet-100/50 hover:-translate-y-1">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-violet-100 to-violet-50 opacity-60 transition-transform group-hover:scale-150" />
              <div className="relative">
                <div className="mb-5 inline-flex rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 p-3.5 text-white shadow-lg shadow-violet-500/20">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Nuestro Objetivo</h3>
                <p className="mt-3 leading-relaxed text-slate-500">
                  El objetivo es ajustarse a las{' '}
                  <strong className="text-slate-700">necesidades particulares de cada estudiante</strong>,
                  teniendo en cuenta el ritmo con el que aprenden y sus habilidades cognitivas. Utilizamos
                  inteligencia artificial de vanguardia para crear rutas de aprendizaje dinámicas que
                  evolucionan junto contigo.
                </p>
              </div>
            </div>
          </div>

          {/* Valores */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: Brain, label: 'Aprendizaje Adaptativo', desc: 'Contenido que se ajusta a ti' },
              { icon: Clock, label: 'A tu Ritmo', desc: 'Sin presiones, sin límites' },
              { icon: Shield, label: 'Retención Duradera', desc: 'Técnicas de repaso científicas' },
              { icon: Star, label: 'Experiencia Premium', desc: 'Diseño intuitivo y moderno' },
            ].map((v) => (
              <div
                key={v.label}
                className="group rounded-2xl border border-slate-200/80 bg-white p-5 text-center shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="mx-auto mb-3 inline-flex rounded-xl bg-brand-50 p-2.5 text-brand-600 transition-colors group-hover:bg-brand-100">
                  <v.icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-bold text-slate-800">{v.label}</p>
                <p className="mt-1 text-xs text-slate-400">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Características ── */}
      <section id="caracteristicas" className="relative py-20 sm:py-28 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-7xl px-5">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
              <Zap className="h-3.5 w-3.5" />
              Funcionalidades
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Todo lo que necesitas para aprender mejor
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
              Herramientas potentes impulsadas por IA que transforman tu manera de estudiar.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: BookOpen,
                title: 'Generación de Cursos',
                desc: 'Convierte cualquier PDF en un curso estructurado con capítulos, módulos y evaluaciones de forma automática.',
                color: 'from-brand-500 to-brand-700',
                shadow: 'shadow-brand-500/20',
                bg: 'bg-brand-50',
              },
              {
                icon: Brain,
                title: 'Tutor IA Conversacional',
                desc: 'Un asistente inteligente impulsado por IA que responde tus dudas, te explica conceptos y te guía paso a paso.',
                color: 'from-violet-500 to-violet-700',
                shadow: 'shadow-violet-500/20',
                bg: 'bg-violet-50',
              },
              {
                icon: BarChart3,
                title: 'Analíticas Detalladas',
                desc: 'Rastreo completo de tu progreso con métricas de rendimiento, tiempo de estudio y áreas de mejora.',
                color: 'from-emerald-500 to-emerald-700',
                shadow: 'shadow-emerald-500/20',
                bg: 'bg-emerald-50',
              },
              {
                icon: Zap,
                title: 'Repetición Espaciada',
                desc: 'Sistema de repaso inteligente diseñado científicamente para la retención de información a largo plazo.',
                color: 'from-amber-500 to-amber-600',
                shadow: 'shadow-amber-500/20',
                bg: 'bg-amber-50',
              },
              {
                icon: Target,
                title: 'Aprendizaje Adaptativo',
                desc: 'El sistema ajusta la dificultad del contenido basándose en tu precisión y ofrece recomendaciones personalizadas.',
                color: 'from-rose-500 to-rose-700',
                shadow: 'shadow-rose-500/20',
                bg: 'bg-rose-50',
              },
              {
                icon: Star,
                title: 'Gamificación',
                desc: 'Gana puntos XP, mantén rachas de estudio y desbloquea insignias para hacer tu aprendizaje más divertido.',
                color: 'from-cyan-500 to-cyan-700',
                shadow: 'shadow-cyan-500/20',
                bg: 'bg-cyan-50',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-10 transition-transform group-hover:scale-150" style={{}} />
                <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${f.color} p-3 text-white shadow-lg ${f.shadow}`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Precios ── */}
      <section id="precios" className="relative py-20 sm:py-28">
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-gradient-to-b from-brand-50/60 to-transparent blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <Star className="h-3.5 w-3.5" />
              Planes y Precios
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Elige el plan perfecto para ti
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
              Comienza gratis y escala a medida que creces. Sin compromisos, cancela cuando quieras.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {/* Free */}
            <PricingCard
              name="Gratis"
              price="$0"
              period="/ mes"
              description="Ideal para empezar tu viaje de aprendizaje"
              features={[
                'Convierte hasta 2 PDFs al mes en cursos estructurados con capítulos y módulos',
                'Acceso a evaluaciones interactivas de opción múltiple',
                'Sistema para ganar puntos XP, mantener rachas de estudio y desbloquear insignias',
                'Acceso limitado a un número fijo de consultas con el tutor conversacional',
              ]}
              featureLabels={[
                'Generación de Cursos',
                'Evaluaciones Básicas',
                'Gamificación',
                'Tutor IA',
              ]}
              cta="Comenzar gratis"
              ctaLink="/register"
              tone="slate"
            />

            {/* Plus – highlighted */}
            <PricingCard
              name="Plus"
              price="$20"
              period="/ mes"
              description="Para estudiantes que buscan más potencia"
              features={[
                'Aumenta el límite para generar cursos automáticos desde cualquier PDF',
                'Explicaciones instantáneas y ayuda continua mediante el chat del tutor de IA impulsado por Claude',
                'Acceso al sistema de repaso inteligente diseñado para la retención de información a largo plazo',
                'Incluye mecánicas como completar espacios en blanco y ejercicios de reflexión',
                'Rastreo detallado del progreso en el viaje de aprendizaje',
              ]}
              featureLabels={[
                'Generación de Cursos',
                'Tutor IA Ilimitado',
                'Repetición Espaciada',
                'Evaluaciones Avanzadas',
                'Analíticas Personales',
              ]}
              cta="Suscribirse al Plus"
              ctaLink="/register"
              popular
              tone="brand"
            />

            {/* Premium */}
            <PricingCard
              name="Premium"
              price="$49"
              period="/ mes"
              description="Para profesores y equipos académicos"
              features={[
                'Sube todos los PDFs que necesites sin restricciones de cantidad',
                'Herramientas exclusivas para editar, organizar y publicar los cursos creados',
                'Panel de control para rastrear el progreso, rendimiento y nivel de participación de múltiples alumnos',
                'El sistema ajusta la dificultad del contenido basándose en la precisión del estudiante y ofrece recomendaciones personalizadas',
              ]}
              featureLabels={[
                'Generación Ilimitada',
                'Gestión de Cursos (Para Profesores)',
                'Analíticas de Estudiantes',
                'Aprendizaje Adaptativo',
              ]}
              cta="Obtener Premium"
              ctaLink="/register"
              tone="violet"
            />
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-violet-700 px-8 py-16 text-center text-white shadow-2xl sm:px-16 sm:py-20">
            {/* Decoration */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-violet-400/20 blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="text-3xl font-extrabold sm:text-4xl">
                ¿Listo para transformar tu manera de estudiar?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
                Únete a la nueva era del aprendizaje personalizado. Comienza hoy completamente gratis.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-bold text-brand-700 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0"
                >
                  Crear cuenta gratis
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/10"
                >
                  Ya tengo cuenta
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900">LearnFlow</span>
                <span className="ml-1 font-extrabold bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
                  AI
                </span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <a href="#nosotros" className="text-sm text-slate-500 hover:text-slate-700 transition">
                Nosotros
              </a>
              <a href="#caracteristicas" className="text-sm text-slate-500 hover:text-slate-700 transition">
                Características
              </a>
              <a href="#precios" className="text-sm text-slate-500 hover:text-slate-700 transition">
                Precios
              </a>
            </div>
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} LearnFlow AI · Todos los derechos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Pricing Card Component                                             */
/* ------------------------------------------------------------------ */
function PricingCard({
  name,
  price,
  period,
  description,
  features,
  featureLabels,
  cta,
  ctaLink,
  popular,
  tone,
}: {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  featureLabels: string[];
  cta: string;
  ctaLink: string;
  popular?: boolean;
  tone: 'slate' | 'brand' | 'violet';
}) {
  const borderColor = popular
    ? 'border-brand-300 shadow-xl shadow-brand-100/50'
    : 'border-slate-200/80 shadow-sm';

  const ctaClasses =
    tone === 'brand'
      ? 'bg-gradient-to-r from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30'
      : tone === 'violet'
        ? 'bg-gradient-to-r from-violet-500 to-violet-700 text-white shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30'
        : 'bg-slate-900 text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800';

  const checkColor =
    tone === 'brand'
      ? 'text-brand-600'
      : tone === 'violet'
        ? 'text-violet-600'
        : 'text-emerald-500';

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-3xl border bg-white p-8 transition-all hover:-translate-y-1 hover:shadow-xl ${borderColor}`}
    >
      {popular && (
        <div className="absolute -right-12 top-6 rotate-45 bg-gradient-to-r from-brand-500 to-brand-700 px-14 py-1.5 text-xs font-bold text-white shadow-sm">
          Popular
        </div>
      )}

      <div>
        <h3
          className={`text-lg font-bold ${
            tone === 'brand'
              ? 'text-brand-700'
              : tone === 'violet'
                ? 'text-violet-700'
                : 'text-slate-900'
          }`}
        >
          {name}
        </h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
        <div className="mt-5 flex items-baseline gap-1">
          <span className="text-4xl font-extrabold text-slate-900">{price}</span>
          <span className="text-sm font-medium text-slate-400">{period}</span>
        </div>
      </div>

      <hr className="my-6 border-slate-100" />

      <ul className="flex-1 space-y-4">
        {features.map((f, i) => (
          <li key={i} className="flex gap-3">
            <div className={`mt-0.5 shrink-0 ${checkColor}`}>
              <Check className="h-4 w-4" strokeWidth={3} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{featureLabels[i]}</p>
              <p className="text-xs leading-relaxed text-slate-500">{f}</p>
            </div>
          </li>
        ))}
      </ul>

      <Link
        to={ctaLink}
        className={`mt-8 block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0 ${ctaClasses}`}
      >
        {cta}
      </Link>
    </div>
  );
}
