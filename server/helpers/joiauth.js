import joi from  "joi"

export const registrationAuth = joi.object({
    username:joi.string().required().min(3),
    email:joi.string().email().required(),
    password:joi.string().pattern(new  RegExp(`^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$`))
    
    })