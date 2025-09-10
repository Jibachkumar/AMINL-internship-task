import { useState, useEffect } from "react";
import "./App.css";
import Input from "./components/Input.jsx";
import {
  fetchTodo,
  addTodo,
  deleteTodo,
  editTodo,
  handleSearchTodo,
} from "./components/apis/todoApi.js";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTodos, setSearchTodos] = useState([]);
  const [editForm, setEditForm] = useState(null);

  const limit = 5;

  // load todos with pagination
  const loadTodos = async () => {
    setError("");
    try {
      const data = await fetchTodo(page, limit);

      if (data) {
        setTodos(data.todos);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    // fetchTodo();
    loadTodos();
  }, [page]);

  // set Time to refetch todos
  const refetchTodos = (second = 3000) => {
    setTimeout(() => {
      // fetchTodo();
      loadTodos();
    }, second);
  };

  // add todo
  const handleAddTodo = async (e) => {
    e.preventDefault();
    setError("");
    setDescription("");
    setTitle("");
    try {
      const data = await addTodo(title, description);

      if (data) {
        setTodos((prev) => [data.todo, ...prev.slice(0, limit - 1)]);

        // after added the todo refresh panigation
        refetchTodos(2000);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // delete todo
  const handleDeleteTodo = async (id) => {
    setError("");
    try {
      await deleteTodo(id);
      refetchTodos(1000);
    } catch (error) {
      setError(error.message);
    }
  };

  //edit todos
  const handleEditTodo = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await editTodo(editForm, editTitle, editDescription);
      refetchTodos(1000);
      setEditForm(null);
      setEditTitle("");
      setEditDescription("");
    } catch (error) {
      setError(error.message);
    }
  };

  // search todo
  const handleTodoSearch = async () => {
    setError("");
    setSearchInput("");
    try {
      const data = await handleSearchTodo(searchInput);
      setSearchTodos(data.todo);
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
              className="w-full border border-black/10 rounded-sm px-3 duration-150 bg-black/70 py-1 hover:border-white/90"
            />
            <button
              onClick={handleTodoSearch}
              className="px-5 py-2 bg-red-900 shadow-md rounded-sm hover:scale-105 transition-all duration-300"
            >
              search
            </button>
          </div>

          <form onSubmit={handleAddTodo} className="flex gap-1 mb-2">
            <Input
              value={title}
              placeholder="write title"
              onChange={setTitle}
              className="w-full border border-black/10 rounded-sm px-3  duration-150 bg-black/70 py-1 hover:border-white/90"
            />
            <Input
              value={description}
              placeholder="write description..."
              onChange={setDescription}
              className="w-full border border-black/10 rounded-sm px-3 duration-150 bg-black/70 py-1 hover:border-white/90"
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
                        onClick={() => {
                          setEditForm(todo._id);
                        }}
                      >
                        {"✏️"}
                      </button>
                      <button
                        className="inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-300 shrink-0"
                        onClick={() => handleDeleteTodo(todo._id)}
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                ))}

              {/* editForm */}
              {editForm && (
                <div className="relative">
                  <form
                    onSubmit={handleEditTodo}
                    className="flex flex-col p-6 gap-y-1 min-w-[30rem] absolute z-10 bg-[#b5bcc5] rounded-md shadow-lg -mb-[20rem] top-0 left-1/2 -translate-x-1/2 -translate-y-[165%]"
                  >
                    <button
                      onClick={() => setEditForm(null)}
                      aria-label="Close"
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black bg-opacity-70 flex items-center justify-center text-white text-lg"
                    >
                      X
                    </button>
                    <Input
                      value={editTitle}
                      placeholder="write title"
                      onChange={setEditTitle}
                      className="w-full border border-black/10 rounded-sm px-3 duration-150 bg-black/70 py-1 hover:border-white/90"
                    />
                    <Input
                      value={editDescription}
                      placeholder="write description..."
                      onChange={setEditDescription}
                      className="w-full border border-black/10 rounded-sm px-3 duration-150 bg-black/70 py-1 hover:border-white/90"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2 bg-red-900 shadow-md rounded-sm hover:scale-105 transition-all duration-300"
                    >
                      Edit
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Pagination button */}
            {totalPages > 1 && (
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
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
