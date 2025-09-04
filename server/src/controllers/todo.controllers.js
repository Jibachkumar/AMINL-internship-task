import { Todo } from "../models/todo.models.js";
import { ApiError } from "../utils/ApiError.js";

const addTodo = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title || !description || !title.trim() || !description.trim()) {
      throw new ApiError(400, "Please add title and description");
    }

    const todo = await Todo.create({
      title,
      description,
    });
    console.log(todo);

    if (!todo) {
      throw new ApiError(
        500,
        "Something Went Wrong while registering the user"
      );
    }

    return res.status(201).json({ todo, message: "sucessfully added todo" });
  } catch (error) {
    next(error);
  }
};

const editTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const todoId = await Todo.findById(id);
    if (!todoId) {
      throw new ApiError(404, "Todo not found");
    }

    if (
      (title === undefined || title.trim() === "") &&
      (description === undefined || description.trim() === "")
    ) {
      throw new ApiError(400, "Please fill the form to update the todo");
    }

    const updatedTodo = {};

    if (title) {
      updatedTodo.title = title;
    }
    if (description) {
      updatedTodo.description = description;
    }

    const todo = await Todo.findByIdAndUpdate(
      id,
      {
        $set: updatedTodo,
      },
      { new: true }
    );

    return res.status(200).json({ todo, message: "Todo updated successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      throw new ApiError(404, "Todo not found");
    }

    return res.status(200).json({ todo, message: "sucessfully deleted todo" });
  } catch (error) {
    next(error);
  }
};

const searchTodo = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query || !query.trim()) {
      throw new ApiError(400, "Please provide a vaild title");
    }

    const todo = await Todo.find({
      title: { $regex: query, $options: "i" }, // regex: return matching all doc not required to match entire string, options: for case-insensitive search
    });

    if (todo.length === 0) {
      throw new ApiError(404, "todo not found");
    }

    return res.status(200).json({ todo });
  } catch (error) {
    next(error);
  }
};

const viewTodo = async (req, res, next) => {
  try {
    // Get page and limit from query params, default to page 1, 10 todos per page
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch paginated todos and skip the todo based on page
    const todos = await Todo.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (todos.length === 0) {
      throw new ApiError(500, "Internal server Error");
    }

    // Get total todos count
    const totalTodos = await Todo.countDocuments();

    return res.status(200).json({
      todos,
      page,
      limit,
      totalPages: Math.ceil(totalTodos / limit),
      totalTodos,
    });
  } catch (error) {
    next(error);
  }
};

export { addTodo, editTodo, deleteTodo, searchTodo, viewTodo };
