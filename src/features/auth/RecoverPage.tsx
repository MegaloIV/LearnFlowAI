import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, KeyRound } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui';
import { toast } from '@/store/useToast';
import { fakeAsync } from '@/lib/fakeAsync';
import { AuthShell } from './AuthShell';

type Step = 'email' | 'code' | 'done';

export function RecoverPage() {
  const navigate = useNavigate();
  const resetPassword = useStore((s) => s.resetPassword);
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    // simula el "envío de correo" generando un código y mostrándolo en pantalla
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await fakeAsync(() => null, 1000);
    setSentCode(code);
    setLoading(false);
    setStep('code');
    toast.info('Código "enviado" (simulado). Lo verás en pantalla.');
  }

  function verifyAndReset(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (codeInput.trim() !== sentCode) {
      setError('El código no coincide.');
      return;
    }
    const res = resetPassword(email, newPassword);
    if (!res.ok) {
      setError(res.error!);
      return;
    }
    setStep('done');
    toast.success('Contraseña actualizada.');
  }

  return (
    <AuthShell title="Recuperar contraseña" subtitle="Te ayudamos a recuperar el acceso.">
      {step === 'email' && (
        <form onSubmit={sendCode} className="space-y-4" noValidate>
          <div>
            <label className="label" htmlFor="email">Correo electrónico</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input id="email" type="email" className="input pl-9" placeholder="tucorreo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Enviar código de recuperación
          </Button>
        </form>
      )}

      {step === 'code' && (
        <form onSubmit={verifyAndReset} className="space-y-4" noValidate>
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
            <KeyRound className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Simulación: tu código es <b className="font-mono">{sentCode}</b> (en una app real
              llegaría por correo).
            </span>
          </div>
          <div>
            <label className="label" htmlFor="code">Código de 6 dígitos</label>
            <input id="code" className="input" placeholder="000000" value={codeInput} onChange={(e) => setCodeInput(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="np">Nueva contraseña</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input id="np" type="password" className="input pl-9" placeholder="Mín. 6 caracteres" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
          </div>
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" size="lg">
            Restablecer contraseña
          </Button>
        </form>
      )}

      {step === 'done' && (
        <div className="space-y-4">
          <p className="rounded-lg bg-emerald-50 px-3 py-3 text-sm text-emerald-700">
            ¡Listo! Tu contraseña fue actualizada. Ya puedes iniciar sesión.
          </p>
          <Button className="w-full" size="lg" onClick={() => navigate('/login')}>
            Ir a iniciar sesión
          </Button>
        </div>
      )}

      <p className="mt-4 text-center text-sm text-slate-500">
        <Link to="/login" className="font-semibold text-brand-600 hover:underline">
          Volver a inicio de sesión
        </Link>
      </p>
    </AuthShell>
  );
}
