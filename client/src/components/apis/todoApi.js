const API_URL = import.meta.env.VITE_API_URL;

//todos panigation
const fetchTodo = async (page, limit) => {
  try {
    const response = await fetch(
      `${API_URL}/api/v1/todos/viewtodo?page=${page}&limit=${limit}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// add todo
const addTodo = async (title, description) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/todos/addtodo`, {
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

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// delete todo
const deleteTodo = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/todos/deletetodo/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

//edit todos
const editTodo = async (editForm, editTitle, editDescription) => {
  try {
    const response = await fetch(
      `${API_URL}/api/v1/todos/edittodo/${editForm}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// search todo
const handleSearchTodo = async (searchInput) => {
  try {
    const response = await fetch(
      `${API_URL}/api/v1/todos/searchtodo?query=${encodeURIComponent(
        searchInput
      )}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export { fetchTodo, addTodo, deleteTodo, editTodo, handleSearchTodo };
