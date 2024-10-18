"use client";
import React, { useState, useEffect } from "react";

const ToDoListPage: React.FC = () => {
  const [todos, setTodos] = useState<{ id: number; text: string; completed: boolean }[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch("http://localhost:4000/todos");
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (newTodo.trim() !== "") {
      try {
        const response = await fetch("http://localhost:4000/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: newTodo, completed: false }),
        });
        const newTodoFromServer = await response.json();
        setTodos([...todos, newTodoFromServer]);
        setNewTodo("");
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await fetch(`http://localhost:4000/todos/${id}`, {
        method: "DELETE",
      });
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleToggleComplete = async (id: number) => {
    const todoToUpdate = todos.find(todo => todo.id === id);
    if (todoToUpdate) {
      try {
        const response = await fetch(`http://localhost:4000/todos/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...todoToUpdate, completed: !todoToUpdate.completed }),
        });
        const updatedTodo = await response.json();
        setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
      } catch (error) {
        console.error("Error updating todo:", error);
      }
    }
  };

  const handleFilterChange = (newFilter: "all" | "completed" | "pending") => {
    setFilter(newFilter);
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true;
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Tareas</h1>
      <div className="flex flex-col items-center w-full max-w-md">
        <div className="mb-4 w-full">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
            placeholder="Nueva tarea"
          />
          <button
            onClick={handleAddTodo}
            className="mt-2 w-full bg-black text-white rounded-full px-4 py-2 hover:bg-gray-700"
          >
            Agregar Tarea
          </button>
        </div>
        <div className="mt-4 w-full g-10">
          <h2 className="text-xl font-bold mb-2">Filtrar Tareas</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => handleFilterChange("all")}
              className={`px-4 py-2 rounded-full mb-2 ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
            >
              Todas
            </button>
            <button
              onClick={() => handleFilterChange("completed")}
              className={`px-4 py-2 rounded-full mb-2 ${filter === "completed" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
            >
              Completadas
            </button>
            <button
              onClick={() => handleFilterChange("pending")}
              className={`px-4 py-2 rounded-full mb-2 ${filter === "pending" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
            >
              Pendientes
            </button>
          </div>
        </div>
        <ul className="w-full mt-4">
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className={`bg-gray-100 mb-2 p-4 rounded shadow text-black flex justify-between items-center ${
                todo.completed ? "line-through" : ""
              }`}
            >
              <span>{todo.text}</span>
              <div className="flex gap-4">
                <button
                  onClick={() => handleToggleComplete(todo.id)}
                  className="bg-green-500 text-white rounded-full px-4 py-2 hover:bg-green-700"
                >
                  {todo.completed ? "Desmarcar" : "Completar"}
                </button>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="bg-red-500 text-white rounded-full px-4 py-2 hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ToDoListPage;