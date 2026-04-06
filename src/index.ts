// src/index.ts
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit'; // Instale: npm install express-rate-limit
import router from './router';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3333;

// --- Requisito 6.5: Rate Limiting ---
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 100, // 100 req por IP
  message: { error: 'Muitas requisições. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// --- Middlewares Globais ---
app.use(helmet()); // Requisito 6.7
app.use(globalLimiter); // Aplica o limite global
app.use(express.json());

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true // Requisito 6.6
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'uma-senha-muito-louca',
  resave: false,
  saveUninitialized: false, // Requisito 6.3
  cookie: {
    httpOnly: true, // Requisito 6.3
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'lax', // Requisito 6.3
    maxAge: 1000 * 60 * 60 * 24 // 1 dia de duração
  }
}));

// As rotas devem vir DEPOIS dos middlewares de sessão e cors
app.use(router); 

app.listen(PORT, () => {
  console.log(`🚀 SmartNotes API rodando na porta ${PORT}`);
});