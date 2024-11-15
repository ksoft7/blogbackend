import Joi from "joi";

export const registerSchema = Joi.object({
  email: Joi.string().required(),
  username: Joi.string().required().min(5).max(20),
  role: Joi.string().valid("regular-user").required(),
  password: Joi.string().required().min(10).max(30),
});
