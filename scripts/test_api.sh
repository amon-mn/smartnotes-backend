#!/bin/bash

# Configurações
API_URL="http://127.0.0.1:3333/v1"
COOKIE_FILE="cookies.txt"
EMAIL="amon_teste@email.com"
SENHA="SenhaForte123!"

# Cores para o terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # Sem cor

echo -e "${BLUE}--- Iniciando Testes Automatizados SmartNotes ---${NC}\n"

# 1. Limpeza
rm -f $COOKIE_FILE

# 2. Cadastro (Signup)
echo -e "${GREEN}[1/5] Testando Cadastro...${NC}"
curl -s -X POST "$API_URL/auth/signup" \
     -H "Content-Type: application/json" \
     -d "{\"nome\": \"Amon Teste\", \"email\": \"$EMAIL\", \"senha\": \"$SENHA\"}" | grep -i "id" && echo "✅ Sucesso" || echo "❌ Erro (ou usuário já existe)"

# 3. Login
echo -e "\n${GREEN}[2/5] Testando Login...${NC}"
curl -s -v -c $COOKIE_FILE -X POST "$API_URL/auth/login" \
     -H "Content-Type: application/json" \
     -d "{\"email\": \"$EMAIL\", \"senha\": \"$SENHA\"}" 2>&1 | grep "200 OK" && echo "✅ Sessão Criada"

# 4. Criar Nota (Create)
echo -e "\n${GREEN}[3/5] Criando uma Nota Real...${NC}"
NOTA_JSON=$(curl -s -b $COOKIE_FILE -X POST "$API_URL/notes" \
     -H "Content-Type: application/json" \
     -d '{"title": "Nota de Teste Automatizado", "content": "Validando o backend no Kali Linux"}')

# Extrair ID da nota (usando grep/sed básico que já vem no Kali)
NOTA_ID=$(echo $NOTA_JSON | grep -oP '(?<="id":")[^"]*')
echo "Nota Criada ID: $NOTA_ID"

# 5. Listar Notas (Index)
echo -e "\n${GREEN}[4/5] Listando Notas do Usuário...${NC}"
curl -s -b $COOKIE_FILE "$API_URL/notes" | grep -i "title" && echo "✅ Listagem OK"

# 6. Logout
echo -e "\n${GREEN}[5/5] Testando Logout...${NC}"
curl -s -b $COOKIE_FILE -X POST "$API_URL/auth/logout" && echo -e "\n✅ Logout OK"

echo -e "\n${BLUE}--- Testes Finalizados ---${NC}"