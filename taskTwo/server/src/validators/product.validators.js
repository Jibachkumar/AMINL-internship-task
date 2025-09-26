import Joi from "joi";

const productModel = Joi.object({
  name: Joi.string().min(4).max(20).required().messages({
    "string.min": "Product name must be at least 4 characters long",
    "string.max": "Product name must be at most 20 characters long",
    "any.required": "Product name is required",
  }),
  price: Joi.number().integer().min(1).max(1000000).required().messages({
    "number.min": "Product price must be at least 1",
    "number.max": "Product price must be at most 100000 ",
    "any.required": "price is required",
  }),
  stock: Joi.number()
    .integer()
    .min(1)
    .optional()
    .messages({ "number.min": "stock must be at least 1" }),
  category: Joi.string().min(4).max(20).required().messages({
    "string.min": "Product category must be at least 4 characters long",
    "string.max": "Product category must be at most 20 characters long",
    "any.required": "product category is required",
  }),
});

export { productModel };
