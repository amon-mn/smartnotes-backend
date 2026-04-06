import Joi from 'joi';

// 1. Exportação nomeada direto na constante
export const signupSchema = Joi.object({
  fullname: Joi.string().min(3).max(100).required().messages({ // Mudei para 100 conforme o PDF Item 3
    'string.min': 'O nome deve ter pelo menos 3 caracteres',
    'any.required': 'O nome é obrigatório'
  }),
  email: Joi.string().email().max(100).required().messages({ // Mudei para 100 conforme o PDF Item 3
    'string.email': 'Informe um e-mail válido',
    'any.required': 'O e-mail é obrigatório'
  }),
  password: Joi.string()
    .min(8)
    .max(128)
    // Regex ajustada para bater com os requisitos do Item 5 do PDF
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});