# SmartQuote API - Documentação para Frontend

## URL Base
```
https://smart-quote-1.onrender.com
```

## Autenticação
Todos os endpoints (exceto `/auth/*`) requerem token JWT no header:
```
Authorization: Bearer <seu_token_jwt>
```

---

## Endpoints Principais

### 🔐 Autenticação

#### Registrar Usuário
```http
POST /auth/register
```
**Body:**
```json
{
  "name": "Joisson",
  "email": "joisson@example.com",
  "password": "Strong@123"
}
```

#### Login
```http
POST /auth/login
```
**Body:**
```json
{
  "email": "joisson@example.com",
  "password": "Strong@123"
}
```
**Retorna:** JWT token

---

### 📧 Cotações por Email

#### Listar Todas as Cotações
```http
GET /emails/quotations
```

#### Cotações Pendentes
```http
GET /emails/quotations/pending
```

#### Buscar Cotação por ID
```http
GET /emails/quotations/{id}
```

#### Aprovar Cotação
```http
POST /emails/quotations/{id}/approve
```

#### Rejeitar Cotação
```http
POST /emails/quotations/{id}/reject
```

#### Editar Cotação
```http
PATCH /emails/quotations/{id}/edit
```

#### Resumo de Status
```http
GET /emails/quotations/status/summary
```

---

### 📝 Formulários de Cotação

#### Submeter Pedido de Cotação
```http
POST /forms
```
**Body:**
```json
{
  "requester": "Nuno Mendes",
  "email": "nuno.mendes@exemplo.com",
  "description": "Preciso de orçamento para 10 computadores",
  "attachments": [
    {
      "fileName": "orcamento.pdf",
      "fileUrl": "https://teste.com/orcamento.pdf",
      "fileType": "application/pdf"
    }
  ]
}
```

#### Listar Pedidos
```http
GET /forms
```

#### Buscar Pedido por ID
```http
GET /forms/quotations/{requestId}
```

---

### 📊 Dashboard

#### Visão Geral
```http
GET /dashboard/overview
```

#### Cotações Recentes
```http
GET /dashboard/recent-quotations
```

#### Aprovações Pendentes
```http
GET /dashboard/pending-approvals
```

#### Aprovar/Rejeitar
```http
POST /dashboard/approvals/{id}/approve
POST /dashboard/approvals/{id}/reject
```

#### Analytics
```http
GET /dashboard/analytics
```

#### Tendências
```http
GET /dashboard/revenue-trends?year=2025
GET /dashboard/quotation-trends?year=2025
```

#### Métricas de Processamento
```http
GET /dashboard/processing-metrics?startDate=2025-11-01&endDate=2025-11-30
```

#### Produtos
```http
GET /dashboard/products
```

---

### 🧾 Faturas

#### Download de PDF
```http
GET /invoices/{numero}/download
```

---

### 📋 Logs

#### Exportar Logs
```http
GET /logs?from=2025-11-01&to=2025-11-05&action=EMAIL_SENT&format=csv
```
**Parâmetros:**
- `from`: Data inicial (YYYY-MM-DD)
- `to`: Data final (YYYY-MM-DD)
- `action`: Filtro por ação (EMAIL_SENT, INVOICE_DOWNLOAD, etc.)
- `format`: json, csv ou pdf

---

### ⚙️ Configurações

#### Configurações Básicas
```http
GET /settings/basic/{adminId}
PATCH /settings/basic/{adminId}
```

#### Gerenciar Usuários
```http
GET /settings/users/{adminId}
PATCH /settings/users/{adminId}/{userId}/role
PATCH /settings/users/{adminId}/{userId}/password
```

#### Perfil do Usuário
```http
PATCH /settings/users/{userId}/profile
PATCH /settings/users/{userId}/password
```

---

## Códigos de Status Mais Comuns

- `200`: Sucesso
- `201`: Criado com sucesso
- `400`: Dados inválidos
- `401`: Não autorizado (token inválido/expirado)
- `404`: Recurso não encontrado
- `500`: Erro interno do servidor

## Exemplo de Uso com Fetch

```javascript
// Login para obter token
const login = async () => {
  const response = await fetch('https://smart-quote-1.onrender.com/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'joisson@example.com',
      password: 'Strong@123'
    })
  });
  
  const data = await response.json();
  return data.token; // Guarde este token
};

// Requisição autenticada
const getQuotations = async (token) => {
  const response = await fetch('https://smart-quote-1.onrender.com/emails/quotations', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.json();
};
```