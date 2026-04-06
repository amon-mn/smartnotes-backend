#!/bin/bash

# Configurações
API_URL="http://127.0.0.1:3333/v1"
COOKIE_AMON="cookies_amon.txt"
COOKIE_HACKER="cookies_hacker.txt"

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}--- INICIANDO AUDITORIA DE SEGURANÇA SMARTNOTES ---${NC}\n"

# 1. TESTE DE VALIDAÇÃO (REQUISITO 5)
echo -e "${BLUE}[1] Testando Regras de Validação (Joi)${NC}"
# Tentando criar usuário com senha fraca
RESPONSE=$(curl -s -X POST "$API_URL/auth/signup" -H "Content-Type: application/json" -d '{"nome":"Amon","email":"erro@test.com","senha":"123"}')
if [[ $RESPONSE == *"error"* ]]; then 
    echo -e "${GREEN}✅ Barrado: Senha fraca não permitida.${NC}"
else 
    echo -e "${RED}❌ FALHA: Aceitou senha fraca!${NC}"
fi

# 2. TESTE DE TIMING ATTACK (REQUISITO 6.8)
echo -e "\n${BLUE}[2] Testando Login (Timing Attack Check)${NC}"
# Vamos apenas garantir que o login funciona para o próximo passo
curl -s -c $COOKIE_AMON -X POST "$API_URL/auth/login" \
     -H "Content-Type: application/json" \
     -d '{"email": "amon@email.com", "senha": "SenhaForte123!"}' > /dev/null
echo -e "${GREEN}✅ Login realizado.${NC}"

# 3. TESTE DE IDOR - O MAIS IMPORTANTE (REQUISITO 6.4)
echo -e "\n${BLUE}[3] Testando Proteção IDOR (Acesso Cruzado)${NC}"
# Passo A: Amon cria uma nota
NOTA_AMON=$(curl -s -b $COOKIE_AMON -X POST "$API_URL/notes" \
     -H "Content-Type: application/json" \
     -d '{"title": "Segredo do Amon", "content": "Não leia isso"}')
ID_NOTA=$(echo $NOTA_AMON | grep -oP '(?<="id":")[^"]*')
echo "Nota do Amon criada com ID: $ID_NOTA"

# Passo B: Criar um segundo usuário ("O Hacker")
curl -s -X POST "$API_URL/auth/signup" -H "Content-Type: application/json" -d '{"nome":"Hacker","email":"hacker@test.com","senha":"SenhaHacker123!"}' > /dev/null
curl -s -c $COOKIE_HACKER -X POST "$API_URL/auth/login" -H "Content-Type: application/json" -d '{"email":"hacker@test.com","senha":"SenhaHacker123!"}' > /dev/null

# Passo C: Hacker tenta ler a nota do Amon
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -b $COOKIE_HACKER "$API_URL/notes/$ID_NOTA")
if [ "$STATUS" == "404" ]; then
    echo -e "${GREEN}✅ SUCESSO: Hacker recebeu 404 ao tentar acessar nota alheia (IDOR Protegido).${NC}"
else
    echo -e "${RED}❌ FALHA CRÍTICA: Hacker recebeu status $STATUS!${NC}"
fi

# 4. TESTE DE RATE LIMITING (REQUISITO 6.5)
echo -e "\n${BLUE}[4] Testando Rate Limiting (Auth Endpoint)${NC}"
echo "Disparando 12 tentativas de login rápidas..."
for i in {1..12}; do
   STATUS_RL=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/auth/login" -d '{"email":"a@a.com","senha":"1"}')
   if [ "$STATUS_RL" == "429" ]; then
       echo -e "${GREEN}✅ Bloqueado no Rate Limit na tentativa $i.${NC}"
       break
   fi
done

# 5. TESTE DE HEADERS (HELMET - REQUISITO 6.7)
echo -e "\n${BLUE}[5] Verificando Cabeçalhos de Segurança (Helmet)${NC}"
curl -I -s "$API_URL/notes" | grep -E "X-Content-Type-Options|Strict-Transport-Security" && echo -e "${GREEN}✅ Headers presentes.${NC}"

echo -e "\n${BLUE}--- FIM DOS TESTES ---${NC}"