import { useState } from "react";
import "./App.css";
import Input from "./components/Input.jsx";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const add = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/v1/todos/addtodo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      console.log(response);

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message);
      }

      if (data) {
        setTodos((prev) => [...prev, data.todo]);
        setDescription("");
        setTitle("");
      }
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
  };

  return (
    <>
      <div className="bg-[#172842] min-h-screen py-8">
        <div className="w-full max-w-2xl mx-auto shadow-md bg-[#6786b4] rounded-lg px-4 py-3 text-white">
          <h1 className="text-2xl font-bold text-center mb-8 mt-2">
            Manage your Todos
          </h1>
          <form onSubmit={add} className="flex gap-1">
            <Input
              value={title}
              placeholder="write title"
              onChange={setTitle}
            />
            <Input
              value={description}
              placeholder="write description..."
              onChange={setDescription}
            />
            <button
              type="submit"
              className="px-5 py-2 bg-blue-800 shadow-md rounded-md hover:scale-105 transition-all duration-300"
            >
              Add
            </button>
          </form>
          {error && <p className="text-red-700">{error}</p>}
        </div>

        <div className="flex flex-wrap flex-col gap-y-3 mt-16">
          {todos.length > 0 &&
            todos.map((todo) => (
              <div
                key={todo._id}
                className="min-w-2xl mx-auto border border-black/10 rounded-lg px-3 py-1.5 gap-x-3 shadow-sm shadow-white/50 duration-300  text-black"
              >
                <label htmlFor={todo.title}>{todo.title}</label>
                <p htmlFor={todo.description}>{todo.description}</p>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default App;
