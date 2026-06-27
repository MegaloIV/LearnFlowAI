import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui';
import { toast } from '@/store/useToast';
import { AuthShell } from './AuthShell';

export function RegisterPage() {
  const navigate = useNavigate();
  const register = useStore((s) => s.register);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    const res = register(name, email, password);
    setLoading(false);
    if (!res.ok) {
      setError(res.error!);
      return;
    }
    toast.success('Cuenta creada. ¡Configuremos tu perfil!');
    navigate('/onboarding');
  }

  return (
    <AuthShell title="Crea tu cuenta" subtitle="Empieza tu camino de aprendizaje personalizado.">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="label" htmlFor="name">Nombre completo</label>
          <div className="relative">
            <UserIcon className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input id="name" className="input pl-9" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="email">Correo electrónico</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input id="email" type="email" className="input pl-9" placeholder="tucorreo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="password">Contraseña</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input id="password" type="password" className="input pl-9" placeholder="Mín. 6" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="confirm">Repetir</label>
            <input id="confirm" type="password" className="input" placeholder="Repite" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
        </div>
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Crear cuenta
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-500">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-semibold text-brand-600 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </AuthShell>
  );
}
