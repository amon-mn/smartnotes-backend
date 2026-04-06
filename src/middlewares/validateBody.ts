import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false, // Captura todos os erros de uma vez, não só o primeiro
      allowUnknown: false, // Impede campos que não estão no schema
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(422).json({ errors: messages }); // 422: Unprocessable Entity
    }

    next(); // Se estiver tudo certo, vai para o Controller
  };
};

export default validate;