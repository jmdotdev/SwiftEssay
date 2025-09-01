import joi from "joi"

export const registrationAuth = joi.object({
    username: joi.string().required().min(3),
    email: joi.string().email().required(),
    password: joi.string().required()
})

export const loginAuth = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
})