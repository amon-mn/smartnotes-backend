import Joi from 'joi';

// 2. Exportação nomeada para bater com o import { noteSchema } do router
export const noteSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    'string.min': 'O título deve ter pelo menos 3 caracteres',
    'any.required': 'O título é obrigatório'
  }),
  content: Joi.string().min(1).required().messages({
    'any.required': 'O conteúdo da nota não pode estar vazio'
  })
});