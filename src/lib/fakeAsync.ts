// Helper que envuelve una función en una Promise con delay artificial,
// para simular "procesamiento" (IA, generación, "envío") y mostrar loaders.

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomBetween(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min));
}

/**
 * Ejecuta `fn` tras un retardo simulado (por defecto 800–1500ms) y devuelve
 * su resultado en una Promise. Refleja las "operaciones asíncronas" del
 * documento técnico sin necesidad de un backend real.
 */
export async function fakeAsync<T>(fn: () => T, ms?: number): Promise<T> {
  const wait = ms ?? randomBetween(800, 1500);
  await delay(wait);
  return fn();
}
