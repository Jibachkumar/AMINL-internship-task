import { Todo } from "../models/todo.models.js";
import { ApiError } from "../utils/ApiError.js";
import logger from "../utils/logger.js";

const addTodo = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      logger.warn("AddTodo failed: Missing title or description");
      throw new ApiError(400, "Please add title and description");
    }

    const todo = await Todo.create({
      title,
      description,
    });

    if (!todo) {
      logger.warn("Failed to create todo");
      throw new ApiError(
        500,
        "Something Went Wrong while registering the user"
      );
    }
    logger.info("Todo added successfully");

    return res.status(201).json({ todo, message: "sucessfully added todo" });
  } catch (error) {
    logger.error("Error in addTodo controller", { error: error.message });
    next(error);
  }
};

const editTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const todoId = await Todo.findById(id);
    if (!todoId) {
      logger.warn("EditTodo failed: Todo not found");
      throw new ApiError(404, "Todo not found");
    }

    if (
      (title === undefined || title.trim() === "") &&
      (description === undefined || description.trim() === "")
    ) {
      logger.warn("EditTodo failed: No fields provided to update");
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
    logger.info("Todo updated successfully");

    return res.status(200).json({ todo, message: "Todo updated successfully" });
  } catch (error) {
    logger.error("Error in editTodo controller", { error: error.message });
    next(error);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      logger.warn("DeleteTodo failed: Todo not found");
      throw new ApiError(404, "Todo not found");
    }

    logger.info("Todo deleted successfully");
    return res.status(200).json({ todo, message: "sucessfully deleted todo" });
  } catch (error) {
    logger.error("Error in deleteTodo controller", { error: error.message });
    next(error);
  }
};

const searchTodo = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query || !query.trim()) {
      logger.warn("SearchTodo failed: invalid query");
      throw new ApiError(400, "Please provide a vaild title");
    }

    const todo = await Todo.find({
      title: { $regex: query, $options: "i" }, // regex: return matching all doc not required to match entire string, options: for case-insensitive search
    });

    if (todo.length === 0) {
      logger.warn("SearchTodo: no todos found");
      throw new ApiError(404, "todo not found");
    }

    logger.info("SearchTodo success");
    return res.status(200).json({ todo });
  } catch (error) {
    logger.error("Error in searchTodo controller", { error: error.message });
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
      logger.warn("No todos found for the current page");
      throw new ApiError(500, "Internal server Error");
    }

    // Get total todos count
    const totalTodos = await Todo.countDocuments();

    logger.info("Todos fetched successfully");
    return res.status(200).json({
      todos,
      page,
      limit,
      totalPages: Math.ceil(totalTodos / limit),
      totalTodos,
    });
  } catch (error) {
    logger.error("Error in viewTodo controller", { error: error.message });
    next(error);
  }
};

export { addTodo, editTodo, deleteTodo, searchTodo, viewTodo };
