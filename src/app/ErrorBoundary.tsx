import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
  info: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, info: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('LearnFlow — error capturado por ErrorBoundary:', error, info);
    this.setState({ info });
  }

  handleReset = () => {
    this.setState({ error: null, info: null });
  };

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-xl rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <h1 className="text-lg font-bold text-red-600">Ups, algo salió mal</h1>
          <p className="mt-1 text-sm text-slate-500">
            Ocurrió un error al renderizar esta vista. Detalle técnico:
          </p>
          <pre className="mt-3 max-h-64 overflow-auto rounded-lg bg-slate-900 p-3 text-xs text-red-200">
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
          <div className="mt-4 flex gap-2">
            <button
              onClick={this.handleReset}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Reintentar
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                location.href = '/';
              }}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Reiniciar datos y volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }
}
