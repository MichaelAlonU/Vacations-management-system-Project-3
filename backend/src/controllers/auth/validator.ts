import Joi from "joi";

export const loginValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required()
})

export const signupValidator = loginValidator.keys({
    firstName: Joi.string().trim().min(2).required(),
    lastName: Joi.string().trim().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required()
})