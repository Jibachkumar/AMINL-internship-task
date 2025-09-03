import { Router } from "express";
import {
  addTodo,
  editTodo,
  searchTodo,
  viewTodo,
  deleteTodo,
} from "../controllers/todo.controllers.js";

const todoRouter = Router();

todoRouter.route("/addtodo").post(addTodo);
todoRouter.route("/edittodo/:id").patch(editTodo);
todoRouter.route("/searchtodo").get(searchTodo);
todoRouter.route("/viewtodo").get(viewTodo);
todoRouter.route("/deletetodo/:id").delete(deleteTodo);

export { todoRouter };
