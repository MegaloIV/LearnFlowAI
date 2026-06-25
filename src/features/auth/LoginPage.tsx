import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui';
import { toast } from '@/store/useToast';
import { AuthShell } from './AuthShell';

export function LoginPage() {
  const navigate = useNavigate();
  const login = useStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const profilesGetter = useStore((s) => s.profiles);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = login(email, password);
    setLoading(false);
    if (!res.ok) {
      setError(res.error!);
      return;
    }
    toast.success('¡Bienvenido de nuevo!');
    // si tiene perfil va al panel, si no al onboarding
    const uid = useStore.getState().currentUserId;
    const hasProfile = profilesGetter.some((p) => p.userId === uid);
    navigate(hasProfile ? '/' : '/onboarding');
  }

  return (
    <AuthShell title="Inicia sesión" subtitle="Continúa donde lo dejaste.">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="label" htmlFor="email">Correo electrónico</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              id="email"
              type="email"
              className="input pl-9"
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="password">Contraseña</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              id="password"
              type="password"
              className="input pl-9"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Entrar
        </Button>
      </form>
      <div className="mt-4 flex items-center justify-between text-sm">
        <Link to="/recover" className="text-brand-600 hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
        <Link to="/register" className="font-semibold text-brand-600 hover:underline">
          Crear cuenta
        </Link>
      </div>
    </AuthShell>
  );
}
