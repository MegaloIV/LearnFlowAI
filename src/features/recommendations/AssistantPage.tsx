import { useEffect, useRef, useState } from 'react';
import { Send, Bot, User as UserIcon, ShieldAlert, Trash2 } from 'lucide-react';
import { chatWithAssistant, RESPONSIBLE_AI_NOTICE } from '@/lib/mockAI';
import { useStore } from '@/store/useStore';
import { Button, Card, SectionTitle, cx } from '@/components/ui';
import { uid } from '@/lib/storage';

const SUGGESTIONS = [
  '¿Por dónde empiezo mi ruta?',
  '¿Cómo organizo mi tiempo de estudio?',
  'Estoy desmotivado, ¿qué hago?',
  '¿Cómo mejoro mi inglés?',
];

export function AssistantPage() {
  const chat = useStore((s) => s.chat);
  const addChatMessage = useStore((s) => s.addChatMessage);
  const clearChat = useStore((s) => s.clearChat);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, typing]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || typing) return;
    addChatMessage({ id: uid('msg'), role: 'user', content, at: new Date().toISOString() });
    setInput('');
    setTyping(true);
    const reply = await chatWithAssistant(content);
    addChatMessage({ id: uid('msg'), role: 'assistant', content: reply, at: new Date().toISOString() });
    setTyping(false);
  }

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Asistente IA"
        subtitle="Orientación instantánea sobre tu aprendizaje."
        action={
          chat.length > 0 ? (
            <Button variant="ghost" size="sm" icon={<Trash2 className="h-4 w-4" />} onClick={clearChat}>
              Limpiar
            </Button>
          ) : undefined
        }
      />

      {/* Aviso de uso responsable (HU-14) */}
      <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{RESPONSIBLE_AI_NOTICE}</span>
      </div>

      <Card className="flex h-[60vh] flex-col p-0">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {chat.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
              <Bot className="mb-3 h-12 w-12 text-slate-300" />
              <p className="text-sm">Hazme una pregunta sobre tu ruta, hábitos o cualquier habilidad.</p>
            </div>
          )}
          {chat.map((m) => (
            <div key={m.id} className={cx('flex gap-3', m.role === 'user' && 'flex-row-reverse')}>
              <div className={cx('grid h-8 w-8 shrink-0 place-items-center rounded-full',
                m.role === 'user' ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-600')}>
                {m.role === 'user' ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={cx('max-w-[78%] rounded-2xl px-4 py-2.5 text-sm',
                m.role === 'user' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700')}>
                {m.content}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-200 text-slate-600">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl bg-slate-100 px-4 py-3">
                <span className="flex gap-1">
                  <Dot /> <Dot delay="0.15s" /> <Dot delay="0.3s" />
                </span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {chat.length === 0 && (
          <div className="flex flex-wrap gap-2 px-5 pb-3">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:border-brand-300 hover:text-brand-600">
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="flex items-center gap-2 border-t border-slate-100 p-3"
        >
          <input
            className="input"
            placeholder="Escribe tu pregunta…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" icon={<Send className="h-4 w-4" />} disabled={!input.trim() || typing}>
            Enviar
          </Button>
        </form>
      </Card>
    </div>
  );
}

function Dot({ delay = '0s' }: { delay?: string }) {
  return (
    <span
      className="inline-block h-2 w-2 animate-bounce rounded-full bg-slate-400"
      style={{ animationDelay: delay }}
    />
  );
}
