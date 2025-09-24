import Joi from "joi";

const userName = Joi.string()
  .pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)+$/)
  .min(5)
  .max(50)
  .required()
  .messages({
    "string.pattern.base":
      "Username must contain only letters and at least a first and last name separated by spaces",
    "string.min": "Username must be at least 10 characters",
    "string.max": "Username must be at most 50 characters",
    "any.required": "Username is required",
  });

const email = Joi.string().email().required().messages({
  "string.email": "Please provide a valid email",
  "any.required": "Email is required",
});

const address = Joi.string().min(3).max(50).required().messages({
  "string.min": "Address must be at least 10 characters long",
  "string.max": "Address must be at most 50 characters long",
  "any.required": "Address is required",
});

const password = Joi.string()
  .pattern(/^[a-zA-Z0-9]{4,20}$/)
  .required()
  .messages({
    "string.pattern.base":
      "Password must be 4-20 characters and also be alphanumeric",
    "any.required": "Password is required",
  });

const phoneNumber = Joi.number()
  .integer()
  .min(1000000000)
  .max(9999999999)
  .required()
  .messages({
    "number.base": "Phone number must be exactly 10 digits",
    "number.min": "Phone number must be exactly 10 digits",
    "number.max": "Phone number must be exactly 10 digits",
  });

const registerSchema = Joi.object({
  userName,
  email,
  address,
  phoneNumber,
  password,
});

const loginSchema = Joi.object({
  email,
  password,
});

const updateAccountSchema = Joi.object({
  userName: userName.optional(),
  email: email.optional(),
  address: address.optional(),
  phoneNumber: phoneNumber.optional(),
});

export { registerSchema, loginSchema, updateAccountSchema };
