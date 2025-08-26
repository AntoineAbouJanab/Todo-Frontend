// app/todos/page.tsx
export const dynamic = 'force-dynamic'; // stop static prerender for this route

import TodosView from './TodosView';

export default function Page() {
  return <TodosView />;
}
