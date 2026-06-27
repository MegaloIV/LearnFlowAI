import { CheckCircle2, Info, XCircle, X } from 'lucide-react';
import { useToast } from '@/store/useToast';
import { cx } from './ui';

const ICONS = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  info: <Info className="h-5 w-5 text-brand-500" />,
};

export function Toaster() {
  const { toasts, dismiss } = useToast();
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cx(
            'pointer-events-auto flex animate-fade-in items-start gap-3 rounded-xl border bg-white px-4 py-3 shadow-lg',
            t.kind === 'success' && 'border-emerald-200',
            t.kind === 'error' && 'border-red-200',
            t.kind === 'info' && 'border-brand-200',
          )}
        >
          {ICONS[t.kind]}
          <p className="flex-1 text-sm text-slate-700">{t.message}</p>
          <button
            onClick={() => dismiss(t.id)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
