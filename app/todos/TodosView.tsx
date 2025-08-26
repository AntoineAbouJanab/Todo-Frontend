// app/todos/TodosView.tsx
'use client';

import { useEffect, useState } from "react";
import API from "../../utils/api";
import { useRouter } from "next/navigation";
import Header from "../Components/Header";

interface Todo {
  _id: string;
  message: string;
  completed: boolean;
}

export default function TodosView() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [ready, setReady] = useState(false); // avoid rendering before client checks

  // Theme: only in browser
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem("theme") : null;
    if (saved === "dark" && typeof document !== 'undefined') {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Auth gate: client-side token check
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  // Fetch after auth ready
  useEffect(() => {
    if (!ready) return;
    fetchTodos();
  }, [ready]);

  const fetchTodos = async () => {
    try {
      const res = await API.get("/todo");
      // If your backend returns { task: [...] } adjust accordingly.
      const data = Array.isArray(res.data) ? res.data : res.data?.task ?? [];
      setTodos(data);
    } catch (err) {
      console.error("Failed to fetch todos:", err);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim() || isAdding) return;
    setIsAdding(true);
    try {
      const res = await API.post("/todo/create", { message: newTodo });
      const created = res.data?.task ?? res.data; // handle either shape
      setTodos((prev) => [...prev, created]);
      setNewTodo("");
    } catch (err) {
      console.error("Add failed:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const toggleComplete = async (id: string) => {
    const todo = todos.find(t => t._id === id);
    if (!todo) return;

    setTodos(todos.map(t => t._id === id ? { ...t, completed: !t.completed } : t));
    try {
      await API.put(`/todo/${id}`, { completed: !todo.completed });
    } catch (err) {
      console.error("Toggle failed:", err);
      setTodos(todos.map(t => t._id === id ? { ...t, completed: todo.completed } : t));
    }
  };

  const deleteTodo = async (id: string) => {
    const prev = todos;
    setDeletingId(id);
    setTodos(prev.filter(t => t._id !== id));
    try {
      await API.delete(`/todo/${id}`);
    } catch (err) {
      console.error("Delete failed:", err);
      setTodos(prev); // rollback
    } finally {
      setDeletingId(null);
    }
  };

  // Wait until auth check finishes to avoid SSR/prerender issues
  if (!ready) return null;

  return (
    <>
      <Header />

      <div className="pt-[7rem] sm:pt-[6rem] px-4 sm:px-6 max-w-2xl mx-auto text-[0.5em] sm:text-xs text-light-grey rounded-none sm:rounded-lg w-full overflow-hidden">
        {/* Fixed bar under header */}
        <div className="fixed top-16 left-0 right-0 z-30 flex flex-col sm:flex-row sm:justify-between border sm:items-center gap-2 px-4 sm:px-6 py-2 bg-gray-300 dark:bg-dark-grey border-b border-gray-700">
          <span className="text-[10px] sm:text-sm text-gray-700 dark:text-gray-300 select-none text-center sm:text-left">
            {todos.filter(todo => todo.completed).length} Completed
          </span>
          <button
            onClick={() => setHideCompleted(!hideCompleted)}
            className="dark:bg-light-grey bg-gray-100 text-grey-800 dark:text-gray-300 text-[15px] sm:text-sm px-3 py-1.5 rounded flex items-center justify-center gap-2 select-none cursor-pointer"
          >
            <img src="/eye.svg" alt="eye" className="w-3 h-3 sm:w-5 sm:h-5" /> Hide Completed
          </button>
        </div>

        {/* List */}
        <div className="max-h-[80vh] overflow-y-auto mt-8">
          <ul className="space-y-2 ">
            {todos
              .filter((t) => (t.completed === hideCompleted || t.completed === false))
              .map((todo) => (
                <li
                  key={todo._id}
                  className="flex justify-between items-start sm:items-center bg-gray-200 dark:bg-[#2d3239] rounded px-3 sm:px-4 py-2 sm:py-3"
                >
                  <span
                    className={`flex-1 flex items-center gap-2 cursor-pointer select-none text-[18px] sm:text-sm leading-snug ${
                      todo.completed ? "text-gray-800 dark:text-gray-400" : "text-gray-600 dark:text-white"
                    }`}
                    onClick={() => toggleComplete(todo._id)}
                  >
                    {todo.completed ? (
                      <>
                        <span className="flex-shrink-0 text-white bg-blue-500 w-3 h-3 sm:w-5 sm:h-5 rounded-sm flex items-center justify-center text-10px sm:text-[35px]">✓</span>
                        <span className="line-through">{todo.message}</span>
                      </>
                    ) : (
                      <>
                        <span className="flex-shrink-0 w-3 h-3 sm:w-5 sm:h-5 border border-gray-400 rounded-sm" />
                        <span>{todo.message}</span>
                      </>
                    )}
                  </span>

                  <button
                    className="ml-2 sm:ml-4 text-gray-400 hover:text-white text-base text-[1.2em] sm:text-xl select-none cursor-pointer"
                    onClick={() => deleteTodo(todo._id)}
                    disabled={deletingId === todo._id}
                    aria-busy={deletingId === todo._id}
                  >
                    <img src="/trash.svg" alt="Delete" className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </li>
              ))}
          </ul>
        </div>

        {/* New todo */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-6 bg-gray-200 dark:bg-light-grey rounded px-3 sm:px-4 py-2">
          <input
            className="flex-1 bg-transparent placeholder-gray-400 text-grey-800 dark:text-white focus:outline-none text-[11px] sm:text-sm"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="New Note"
          />
          <button
            onClick={addTodo}
            className="bg-blue-500 text-white dark:bg-white dark:text-gray-800 font-medium px-3 py-2 sm:px-4 sm:py-2 rounded select-none cursor-pointer text-[11px] sm:text-sm"
            disabled={isAdding}
            aria-busy={isAdding}
          >
            Add New Note
          </button>
        </div>
      </div>
    </>
  );
}
