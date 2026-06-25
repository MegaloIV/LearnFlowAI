import type { ReactNode } from 'react';
import { GraduationCap } from 'lucide-react';

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Panel decorativo */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-br from-brand-600 to-brand-800 p-12 text-white lg:flex">
        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="text-lg font-extrabold">LearnFlow AI</span>
        </div>
        <div>
          <h1 className="text-3xl font-extrabold leading-tight">
            Aprende a tu ritmo, con un plan hecho para ti.
          </h1>
          <p className="mt-4 max-w-md text-brand-100">
            Diagnóstico inteligente, rutas personalizadas, seguimiento de progreso y un asistente
            que te orienta paso a paso.
          </p>
        </div>
        <p className="text-xs text-brand-200">
          Prototipo de simulación · 100% frontend · sin backend real
        </p>
      </div>

      {/* Formulario */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-slate-900">LearnFlow AI</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
