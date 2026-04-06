# SmartNotes API — Backend Implementation 🚀

---

## 1. Descrição

Esta é a implementação da API RESTful para o sistema **SmartNotes**, desenvolvida conforme as especificações da disciplina de Desenvolvimento Web.

O foco central deste backend é a **segurança no manejo de notas pessoais**, garantindo que cada usuário gerencie exclusivamente seus próprios dados sob uma arquitetura protegida contra ataques comuns.

---

## 2. Stack Tecnológica Utilizada

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Linguagem | TypeScript |
| ORM | Prisma |
| Banco de dados | MySQL |
| Validação | Joi |
| Autenticação | express-session |
| Hash de senha | bcryptjs |
| Segurança | Helmet, Express-rate-limit |

---

## 3. Modelo de dados

A aplicação possui duas entidades principais:

### User

| Campo | Tipo | Restrições |
|---|---|---|
| `id` | `String` | UUID, chave primária |
| `email` | `String` | Único, máx. 100 caracteres |
| `fullname` | `String` | Máx. 100 caracteres |
| `password` | `String` | 60 caracteres (hash bcrypt) |
| `createdAt` | `DateTime` | Gerado automaticamente |
| `updatedAt` | `DateTime` | Atualizado automaticamente |

---

### Note

| Campo | Tipo | Restrições |
|---|---|---|
| `id` | `String` | UUID, chave primária |
| `userId` | `String` | Chave estrangeira → User |
| `title` | `String` | Máx. 100 caracteres |
| `content` | `String` | Texto longo |
| `createdAt` | `DateTime` | Gerado automaticamente |
| `updatedAt` | `DateTime` | Atualizado automaticamente |

---

## 4. Funcionalidades de Segurança

### 4.1 Autorização e Proteção IDOR

- Antes de qualquer operação (`GET`, `PUT`, `DELETE`) em uma nota, a API valida se o `userId` corresponde ao usuário autenticado.
- Em caso de falha, retorna **`404 Not Found`**, evitando expor a existência de recursos de terceiros.

---

### 4.2 Proteção contra Timing Attack

- A verificação de senha com **bcrypt** é executada **independentemente da existência do e-mail**, garantindo tempo de resposta uniforme e evitando enumeração de usuários.

---

### 4.3 Sessão e Headers Seguros

- **Cookies:**
  - `httpOnly: true`
  - `sameSite: "lax"`
  - `saveUninitialized: false`

- **Helmet:**
  - Remove `X-Powered-By`
  - Ativa proteção contra sniffing
  - Habilita HSTS

- **Rate Limiting:**
  - Global: `100 req / 15 min`
  - Autenticação: `10 req / 15 min`

---

## 5. Como Executar

```bash
npm install
```

Configure o arquivo `.env`:

```
DATABASE_URL=
SESSION_SECRET=
FRONTEND_URL=
PORT=3333
```

Execute as migrations:

```bash
npx prisma migrate dev
```

Inicie o servidor:

```bash
npm run dev
```

---

## 6. Integração com Frontend

O frontend deve ser configurado com:

```
NEXT_PUBLIC_API_URL=http://localhost:3333/v1
```

para comunicação correta com a API.
