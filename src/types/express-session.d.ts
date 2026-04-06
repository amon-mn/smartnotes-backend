import 'express-session';

declare module 'express-session' {
  interface SessionData {
    uid: string; // Ou number, dependendo de como está no seu Prisma
  }
}