import { PrismaClient, User } from '../../generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const FAKE_HASH = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgNI9Xf.3lV9P4pB9l.rR8Vf4q32";

// 1. Alterei os nomes dos parâmetros para fullname e password (consistência com o PDF)
const signup = async (fullname: string, email: string, password: string): Promise<User> => {
  const usuarioExistente = await prisma.user.findUnique({ where: { email } });
  
  if (usuarioExistente) {
    // O Controller vai capturar isso e retornar 400 conforme o PDF
    throw new Error('Este e-mail já está cadastrado');
  }

  const salt = await bcrypt.genSalt(10);
  const senhaHash = await bcrypt.hash(password, salt);

  return await prisma.user.create({
    // 2. Mapeie aqui: 'nome' e 'senha' são os campos no seu schema.prisma
    data: { 
      nome: fullname, 
      email, 
      senha: senhaHash 
    },
  });
};

const login = async (email: string, password: string): Promise<User | null> => {
  const usuario = await prisma.user.findUnique({ where: { email } });

  // Mantendo sua excelente lógica de Timing Attack
  const hashParaComparar = usuario ? usuario.senha : FAKE_HASH;
  const senhaOk = await bcrypt.compare(password, hashParaComparar);

  if (!usuario || !senhaOk) {
    return null; 
  }

  return usuario;
};

export default { signup, login };