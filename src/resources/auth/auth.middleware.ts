import { Request, Response, NextFunction } from 'express';

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  // Se existir o ID do usuário na sessão, ele está logado
  if (req.session.uid) {
    return next(); // "Pode passar!" -> Vai para o Controller
  }

  // Se não existir, barramos com 401 Unauthorized (Requisito 6.4)
  res.status(401).json({ error: 'Acesso negado. Por favor, faça login.' });
};

export default isAuthenticated;