'use client';

import { useEffect, useState } from "react";
import API from "../../utils/api";
import withAuth from "../../utils/withAuth";
import Header from "../Components/Header";
import '../globals.css'; 


interface Todo {
  _id: string;
  message: string;
  completed: boolean;
}

function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [hideCompleted, setHideCompleted] = useState(false);


useEffect(() => {
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
  }
}, []);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await API.get("/todo");

          console.log("FULL RESPONSE FROM BACKEND:", res.data);     // 🧠


      const newTask = res.data.task;
      console.log("Fetched Todos:", newTask);
      setTodos(res.data);
    } catch (err) {
      console.error("Failed to fetch todos:", err);
    }
  };

const addTodo = async () => {
  if (!newTodo.trim() || isAdding) return; // ❌ Prevent empty or double clicks

  setIsAdding(true); // 🚫 Disable the button immediately

  try {
    const res = await API.post("/todo/create", { message: newTodo });
    setTodos([...todos, res.data.task]);
    setNewTodo("");
    console.log("Todo added:", res.data.task);
  } catch (err) {
    console.error("Add failed:", err);
  } finally {
    setIsAdding(false); // ✅ Re-enable after finish
  }
};


const toggleComplete = async (id: string) => {
  const todo = todos.find(t => t._id === id);
  if (!todo) return;

  // ✅ Optimistically update the UI
  setTodos(todos.map(t =>
    t._id === id ? { ...t, completed: !t.completed } : t
  ));

  try {
    // ✅ Send request in background
    await API.put(`/todo/${id}`, { completed: !todo.completed });
  } catch (err) {
    console.error("Toggle failed:", err);

    // ⛔ If error, revert UI (optional)
    setTodos(todos.map(t =>
      t._id === id ? { ...t, completed: todo.completed } : t
    ));
  }
};


const deleteTodo = async (id: string) => {
  // ✅ Optimistically remove the task from UI
  const updatedTodos = todos.filter(todo => todo._id !== id);
  setTodos(updatedTodos);
  setDeletingId(id);

  try {
    await API.delete(`/todo/${id}`);
    console.log("Deleted the todo");
  } catch (err) {
    console.error("Delete failed:", err);

    // ⛔ Optional rollback (if you want to re-add it in case of failure)
    setTodos(todos); // revert to original
  } finally {
    setDeletingId(null);
  }
};






  return (
<>
  {/* Make sure this header has z-50 */}
  <Header  />

  {/* Main Container (with enough padding for both fixed Header + Hide Completed) */}
  <div className="pt-[7rem] sm:pt-[6rem] px-4 sm:px-6 max-w-2xl mx-auto text-[0.5em] sm:text-xs text-light-grey rounded-none sm:rounded-lg w-full overflow-hidden">

    {/* Completed Count + Hide Button (Fixed below Header) */}
    <div className="fixed top-16 left-0 right-0 z-30 flex flex-col sm:flex-row sm:justify-between border sm:items-center gap-2 px-4 sm:px-6 py-2 bg-dark-grey border-b border-gray-700">
      <span className="text-[10px] sm:text-sm text-gray-400 select-none text-center sm:text-left">
        {todos.filter(todo => todo.completed).length} Completed
      </span>
      <button
        onClick={() => {
          setHideCompleted(!hideCompleted);
          console.log(hideCompleted);
        }}
        className="bg-light-grey text-white text-[15px] sm:text-sm px-3 py-1.5 rounded flex items-center justify-center gap-2 select-none cursor-pointer"
      >
        <img src="/eye.svg" alt="eye" className="w-3 h-3 sm:w-5 sm:h-5" /> Hide Completed
      </button>
    </div>

    {/* Todo List */}
    <div className="max-h-[80vh] overflow-y-auto mt-8">
      <ul className="space-y-2 ">
        {todos
          .filter((t) => (t.completed === hideCompleted || t.completed == false))
          .map((todo) => (
            <li
              key={todo._id}
              className="flex justify-between items-start sm:items-center bg-dark-grey rounded px-3 sm:px-4 py-2 sm:py-0.5"
            >
              <span
                className={`flex-1 flex items-center gap-2 cursor-pointer select-none text-[18px] sm:text-sm leading-snug ${
                  todo.completed ? "text-gray-400" : "text-white"
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
              >
                <img src="./trash.svg" alt="Delete" className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </li>
          ))}
      </ul>
    </div>

    {/* New Todo Input */}
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-6 bg-light-grey rounded px-3 sm:px-4 py-2">
      <input
        className="flex-1 bg-transparent placeholder-gray-400 text-white focus:outline-none text-[11px] sm:text-sm"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="New Note"
      />
      <button
        onClick={addTodo}
        className="bg-white text-black font-medium px-3 py-2 sm:px-4 sm:py-2 rounded select-none cursor-pointer text-[11px] sm:text-sm"
      >
        Add New Note
      </button>
    </div>
    
  </div>
</>


  );
}

export default withAuth(TodosPage);
