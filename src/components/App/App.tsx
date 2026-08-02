import { JsonFormatter } from 'src/components/JsonFormatter';

export function App() {
  return (
    <main className="max-w-(--breakpoint-xl) p-8 text-center dark:bg-slate-900 dark:text-slate-100">
      <JsonFormatter />
    </main>
  );
}
