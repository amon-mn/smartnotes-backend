import { Request, Response } from 'express';
import authService from './auth.service';

const signup = async (req: Request, res: Response) => {
  try {
    // 1. Desestrutura usando os nomes que o Frontend do professor envia (PDF 4.1)
    const { fullname, email, password } = req.body;
    
    // 2. Passa para o service (garanta que seu service aceite esses nomes ou mapeie-os)
    const novoUsuario = await authService.signup(fullname, email, password);
    
    // 3. Retorna 201 e o usuário sem a senha (Requisito 4.1 do PDF)
    res.status(201).json(novoUsuario);
  } catch (error: any) {
    // 4. Se o e-mail já existir, o PDF pede status 400
    res.status(400).json({ error: error.message || 'E-mail já cadastrado' });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.login(email, password);

  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' }); // Status 401 conforme PDF
  }

  req.session.uid = user.id; // Inicia a sessão
  
  
  return res.status(200).json({ msg: "Usuário autenticado" });
};

const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Erro ao deslogar' });
    
    // 1. O PDF pede Status 200 para logout (e não 204)
    res.clearCookie('connect.sid'); // Garante a remoção do cookie no navegador
    res.status(200).json({ msg: "Sessão destruída. Cookie removido" });
  });
};

export default { signup, login, logout };