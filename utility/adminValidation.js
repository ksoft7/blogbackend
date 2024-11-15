import Joi from "joi";
export const registeradminSchema = Joi.object({
  username: Joi.string().required().min(5).max(20),
  role: Joi.string().valid("admin").required(),
  password: Joi.string().required().min(10).max(30),
});
