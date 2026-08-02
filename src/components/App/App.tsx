import { JsonFormatter } from 'src/components/JsonFormatter';

export function App() {
  return (
    <main className="mx-auto w-full max-w-(--breakpoint-xl) p-8 text-center dark:bg-slate-900 dark:text-slate-100">
      <JsonFormatter />
    </main>
  );
}
