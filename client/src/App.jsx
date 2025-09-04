import { useState, useEffect } from "react";
import "./App.css";
import Input from "./components/Input.jsx";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTodos, setSearchTodos] = useState([]);

  const limit = 5;

  //todos panigation
  const fetchTodo = async () => {
    setError("");
    try {
      const response = await fetch(
        `/api/v1/todos/viewtodo?page=${page}&limit=${limit}`
      );

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message);
      }

      if (data) {
        setTodos(data.todos);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchTodo();
  }, [page]);

  // set Time to refetch todos
  const refetchTodos = (second = 3000) => {
    setTimeout(() => {
      fetchTodo();
    }, second);
  };

  // add todo
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

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message);
      }

      if (data) {
        setTodos((prev) => [data.todo, ...prev.slice(0, limit - 1)]);
        setDescription("");
        setTitle("");

        // after added the todo refresh panigation
        refetchTodos(2000);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // delete todo
  const deleteTodo = async (id) => {
    setError("");
    try {
      const response = await fetch(`/api/v1/todos/deletetodo/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      refetchTodos(1000);
    } catch (error) {
      setError(error.message);
    }
  };

  //edit todos
  const editTodo = async (id) => {
    setError("");
    try {
      const response = await fetch(`/api/v1/todos/edittodo/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message);
      }

      refetchTodos(2000);
    } catch (error) {
      setError(error.message);
    }
  };

  // search todo
  const handleTodoSearch = async (searchInput) => {
    setError("");
    setSearchInput("");
    try {
      const response = await fetch(
        `/api/v1/todos/searchtodo?query=${encodeURIComponent(searchInput)}`
      );

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message);
      }
      setSearchTodos(data.todo);
      setSearchInput("");
    } catch (error) {
      setError(error.message);
      setSearchTodos([]);
    }
  };

  return (
    <>
      <div className="bg-[#172842] min-h-screen py-8">
        <div className="w-full max-w-2xl mx-auto shadow-md bg-[#213555] rounded-lg px-4 py-3 text-white">
          <h1 className="text-2xl font-bold text-center mb-5 font-serif">
            Manage your Todos
          </h1>

          {/*  search todos */}
          <div className="flex mx-auto gap-x-1 mb-5 w-[25rem]">
            <Input
              placeholder="Search..."
              value={searchInput}
              onChange={setSearchInput}
            />
            <button
              onClick={() => handleTodoSearch(searchInput)}
              className="px-5 py-2 bg-red-900 shadow-md rounded-sm hover:scale-105 transition-all duration-300"
            >
              search
            </button>
          </div>

          <form onSubmit={add} className="flex gap-1 mb-2">
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
              className="px-5 py-2 bg-red-900 shadow-md rounded-sm hover:scale-105 transition-all duration-300"
            >
              Add
            </button>
          </form>
        </div>
        {error && <p className="text-red-700 text-center">{error}</p>}

        {/* displayed todos and searched todos */}
        {searchTodos.length > 0 ? (
          <div className="flex h-[360px] flex-wrap flex-col gap-y-3 mt-16">
            {searchTodos.map((todo) => (
              <div
                key={todo._id}
                className="min-w-2xl flex justify-between mx-auto border border-white/10 bg-white rounded-lg px-3 py-1.5 gap-x-3 shadow-sm shadow-white/50 duration-300 text-black"
              >
                <div>
                  <label
                    htmlFor={todo.title}
                    className="font-semibold font-serif"
                  >
                    {todo.title}
                  </label>
                  <p htmlFor={todo.description} className="text-sm">
                    {todo.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // display panigation result
          <div>
            <div className="flex h-[360px] flex-wrap flex-col gap-y-3 mt-16">
              {todos &&
                todos.map((todo) => (
                  <div
                    key={todo._id}
                    className="min-w-2xl flex justify-between mx-auto border border-white/10 bg-white rounded-lg px-3 py-1.5 gap-x-3 shadow-sm shadow-white/50 duration-300  text-black"
                  >
                    <div>
                      <label
                        htmlFor={todo.title}
                        className="font-semibold font-serif"
                      >
                        {todo.title}
                      </label>
                      <p htmlFor={todo.description} className="text-sm">
                        {todo.description}
                      </p>
                    </div>

                    <div className="flex gap-x-2 items-center">
                      <button
                        className="inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-300 shrink-0 disabled:opacity-50"
                        onClick={() => editTodo(todo._id)}
                      >
                        {"✏️"}
                      </button>
                      <button
                        className="inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-300 shrink-0"
                        onClick={() => deleteTodo(todo._id)}
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Pagination button */}
            <div className="w-2xl flex mx-auto justify-between">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className={`px-3 py-1 rounded-md shadow-md transition-all duration-300 bg-white
                  ${
                    page === 1
                      ? "cursor-not-allowed opacity-50"
                      : " hover:scale-105"
                  }`}
              >
                Prev
              </button>

              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className={`px-3 py-1 rounded-md shadow-md transition-all duration-300 bg-white
                  ${
                    page === totalPages
                      ? "cursor-not-allowed opacity-50"
                      : " hover:scale-105"
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
