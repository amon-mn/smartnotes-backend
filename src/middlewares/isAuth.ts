import { Request, Response, NextFunction } from 'express';

const isAuth = (req: Request, res: Response, next: NextFunction) => {
  // Verificamos se o UID do usuário existe na sessão
  if (req.session && req.session.uid) {
    return next(); // Usuário autenticado, pode seguir para o Controller
  }

  // REQUISITO 4.1 e 4.2: Se não estiver autenticado, retorna 401
  return res.status(401).json({ error: 'Usuário não autenticado' });
};

export default isAuth;