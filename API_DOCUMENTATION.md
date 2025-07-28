# Documentação das APIs - NineTwoDash

## Visão Geral

O NineTwoDash expõe uma API RESTful construída com Next.js API Routes. Todas as endpoints seguem convenções REST e retornam dados em formato JSON.

## Autenticação

A API usa NextAuth.js para autenticação. A maioria das endpoints requer autenticação via session token.

### Headers Requeridos
```http
Cookie: next-auth.session-token=<token>
Content-Type: application/json
```

## Base URL

- **Desenvolvimento**: `http://localhost:3000/api`
- **Produção**: `https://seu-dominio.com/api`

## Endpoints

### Autenticação

#### POST /api/auth/signin
Realiza login no sistema.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "url": "http://localhost:3000/admin/dashboard"
}
```

#### POST /api/auth/signout
Realiza logout do sistema.

**Response:**
```json
{
  "url": "http://localhost:3000/login"
}
```

#### GET /api/auth/session
Retorna a sessão atual do usuário.

**Response:**
```json
{
  "user": {
    "id": "1",
    "email": "admin@ninetwodash.com",
    "name": "Admin",
    "role": "admin",
    "clientId": null
  },
  "expires": "2024-02-01T00:00:00.000Z"
}
```

### Admin - Clientes

#### GET /api/admin/clients
Lista todos os clientes cadastrados.

**Query Parameters:**
- `page` (optional): Número da página (default: 1)
- `limit` (optional): Itens por página (default: 10)
- `search` (optional): Busca por nome ou email

**Response:**
```json
{
  "clients": [
    {
      "_id": "65abc123...",
      "name": "Cliente Exemplo",
      "email": "cliente@example.com",
      "slug": "cliente-exemplo",
      "status": "active",
      "monthlyBudget": 5000,
      "tags": ["e-commerce", "pme"],
      "googleAds": {
        "connected": true,
        "lastSync": "2024-01-20T10:00:00Z"
      },
      "facebookAds": {
        "connected": false
      },
      "googleAnalytics": {
        "connected": true,
        "lastSync": "2024-01-20T10:00:00Z"
      }
    }
  ],
  "total": 25,
  "page": 1,
  "pages": 3
}
```

#### POST /api/admin/clients
Cria um novo cliente.

**Request Body:**
```json
{
  "name": "Novo Cliente",
  "email": "novo@cliente.com",
  "monthlyBudget": 10000,
  "tags": ["saas", "b2b"]
}
```

**Response:**
```json
{
  "client": {
    "_id": "65abc456...",
    "name": "Novo Cliente",
    "email": "novo@cliente.com",
    "slug": "novo-cliente",
    "status": "active",
    "monthlyBudget": 10000,
    "createdAt": "2024-01-20T15:00:00Z"
  },
  "credentials": {
    "email": "novo@cliente.com",
    "password": "senhaGerada123",
    "portalUrl": "http://localhost:3000/portal/novo-cliente"
  }
}
```

#### GET /api/admin/clients/[clientId]
Retorna detalhes de um cliente específico.

**Response:**
```json
{
  "client": {
    "_id": "65abc123...",
    "name": "Cliente Exemplo",
    "email": "cliente@example.com",
    "slug": "cliente-exemplo",
    "status": "active",
    "monthlyBudget": 5000,
    "tags": ["e-commerce", "pme"],
    "portalSettings": {
      "primaryColor": "#3B82F6",
      "secondaryColor": "#8B5CF6",
      "allowedSections": ["dashboard", "campaigns", "reports"]
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-20T10:00:00Z"
  }
}
```

#### PUT /api/admin/clients/[clientId]
Atualiza dados de um cliente.

**Request Body:**
```json
{
  "name": "Cliente Atualizado",
  "monthlyBudget": 7500,
  "status": "active",
  "tags": ["e-commerce", "enterprise"]
}
```

#### DELETE /api/admin/clients/[clientId]
Remove um cliente (soft delete).

**Response:**
```json
{
  "message": "Cliente removido com sucesso"
}
```

### Admin - Credenciais de API

#### POST /api/admin/clients/[clientId]/credentials
Salva credenciais de API para um cliente.

**Request Body:**
```json
{
  "platform": "google_ads",
  "credentials": {
    "developer_token": "abc123...",
    "client_id": "123456.apps.googleusercontent.com",
    "client_secret": "secret123",
    "refresh_token": "1//refresh123..."
  }
}
```

**Response:**
```json
{
  "message": "Credenciais salvas com sucesso",
  "platform": "google_ads"
}
```

#### POST /api/admin/clients/[clientId]/test-connections
Testa as conexões de API configuradas.

**Response:**
```json
{
  "results": {
    "google_ads": {
      "success": true,
      "message": "Conectado com sucesso",
      "accounts": ["123-456-7890"]
    },
    "facebook_ads": {
      "success": false,
      "error": "Token expirado"
    },
    "google_analytics": {
      "success": true,
      "message": "Conectado com sucesso",
      "properties": ["GA4-123456"]
    }
  }
}
```

### Dashboard e Métricas

#### GET /api/dashboard/[clientId]
Retorna dados do dashboard para um cliente.

**Query Parameters:**
- `period`: Período dos dados (`7d`, `30d`, `90d`)
- `platform`: Filtrar por plataforma (opcional)

**Response:**
```json
{
  "summary": {
    "totalSpent": 15750.50,
    "totalClicks": 4523,
    "totalImpressions": 125000,
    "totalConversions": 89,
    "avgCPC": 3.48,
    "avgCTR": 3.62,
    "conversionRate": 1.97,
    "roas": 4.2
  },
  "charts": {
    "daily": [
      {
        "date": "2024-01-20",
        "impressions": 5000,
        "clicks": 180,
        "cost": 625.50,
        "conversions": 4
      }
    ],
    "platforms": [
      {
        "platform": "google_ads",
        "cost": 10000,
        "percentage": 63.5
      },
      {
        "platform": "facebook_ads",
        "cost": 5750.50,
        "percentage": 36.5
      }
    ]
  },
  "campaigns": [
    {
      "id": "123",
      "name": "Brand - Search",
      "platform": "google_ads",
      "status": "active",
      "cost": 2500,
      "clicks": 850,
      "conversions": 23
    }
  ]
}
```

### Campanhas

#### GET /api/campaigns/[clientId]
Lista campanhas de um cliente.

**Query Parameters:**
- `platform`: Filtrar por plataforma
- `status`: Filtrar por status (`active`, `paused`, `completed`)
- `period`: Período dos dados

**Response:**
```json
{
  "campaigns": [
    {
      "_id": "65abc789...",
      "campaignId": "123456",
      "campaignName": "Black Friday 2024",
      "platform": "google_ads",
      "status": "active",
      "metrics": {
        "impressions": 50000,
        "clicks": 2500,
        "cost": 3750.00,
        "conversions": 125,
        "ctr": 5.0,
        "cpc": 1.50,
        "conversionRate": 5.0,
        "roas": 6.67
      }
    }
  ],
  "total": 15
}
```

### Analytics

#### GET /api/analytics/[clientId]
Retorna dados do Google Analytics.

**Query Parameters:**
- `startDate`: Data inicial (YYYY-MM-DD)
- `endDate`: Data final (YYYY-MM-DD)
- `metrics`: Métricas desejadas (separadas por vírgula)

**Response:**
```json
{
  "summary": {
    "sessions": 15420,
    "users": 12350,
    "newUsers": 8900,
    "pageviews": 45230,
    "avgSessionDuration": 185,
    "bounceRate": 42.5
  },
  "trafficSources": [
    {
      "source": "google",
      "medium": "cpc",
      "sessions": 5420,
      "percentage": 35.2
    }
  ],
  "topPages": [
    {
      "pagePath": "/produtos/tenis-running",
      "pageTitle": "Tênis Running - Loja",
      "pageviews": 3420,
      "avgTimeOnPage": 95
    }
  ],
  "devices": [
    {
      "deviceCategory": "mobile",
      "sessions": 9500,
      "percentage": 61.6
    }
  ]
}
```

### Relatórios

#### GET /api/reports/[clientId]
Lista relatórios de um cliente.

**Response:**
```json
{
  "reports": [
    {
      "_id": "65abc999...",
      "title": "Relatório Mensal - Janeiro 2024",
      "type": "monthly",
      "period": {
        "from": "2024-01-01",
        "to": "2024-01-31"
      },
      "createdAt": "2024-02-01T10:00:00Z",
      "generatedBy": {
        "name": "Admin",
        "email": "admin@ninetwodash.com"
      }
    }
  ]
}
```

#### POST /api/reports/[clientId]
Gera um novo relatório.

**Request Body:**
```json
{
  "title": "Relatório Personalizado",
  "type": "custom",
  "period": {
    "from": "2024-01-01",
    "to": "2024-01-15"
  },
  "includeSections": [
    "summary",
    "campaigns",
    "analytics",
    "recommendations"
  ]
}
```

#### GET /api/reports/[clientId]/[reportId]
Retorna detalhes de um relatório.

### Integrações OAuth

#### GET /api/auth/google-ads
Inicia fluxo OAuth para Google Ads.

**Query Parameters:**
- `clientId`: ID do cliente

**Response:** Redireciona para Google OAuth

#### GET /api/auth/google-ads/callback
Callback do OAuth Google Ads.

**Query Parameters:**
- `code`: Código de autorização
- `state`: Estado com clientId

#### GET /api/auth/facebook-ads
Inicia fluxo OAuth para Facebook Ads.

#### GET /api/auth/facebook-ads/callback
Callback do OAuth Facebook Ads.

#### GET /api/auth/google-analytics
Inicia fluxo OAuth para Google Analytics.

#### GET /api/auth/google-analytics/callback
Callback do OAuth Google Analytics.

### Utilitários

#### POST /api/test-connection/googleAds
Testa conexão com Google Ads.

**Request Body:**
```json
{
  "credentials": {
    "developer_token": "...",
    "client_id": "...",
    "client_secret": "...",
    "refresh_token": "..."
  }
}
```

#### POST /api/test-connection/facebookAds
Testa conexão com Facebook Ads.

#### POST /api/test-connection/googleAnalytics
Testa conexão com Google Analytics.

## Códigos de Status HTTP

- `200 OK`: Requisição bem-sucedida
- `201 Created`: Recurso criado com sucesso
- `400 Bad Request`: Dados inválidos na requisição
- `401 Unauthorized`: Não autenticado
- `403 Forbidden`: Sem permissão para acessar
- `404 Not Found`: Recurso não encontrado
- `409 Conflict`: Conflito (ex: email já existe)
- `500 Internal Server Error`: Erro no servidor

## Tratamento de Erros

Todas as respostas de erro seguem o formato:

```json
{
  "error": {
    "message": "Descrição do erro",
    "code": "ERROR_CODE",
    "details": {
      "field": "Informação adicional"
    }
  }
}
```

## Rate Limiting

As APIs possuem limites de requisições:

- **Autenticação**: 5 requisições por minuto
- **Leitura**: 100 requisições por minuto
- **Escrita**: 30 requisições por minuto
- **Integrações externas**: 10 requisições por minuto

Headers de resposta incluem:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1706700000
```

## Webhooks (Futuro)

Sistema de webhooks para notificações em tempo real:

```json
{
  "event": "campaign.updated",
  "data": {
    "clientId": "123",
    "campaignId": "456",
    "changes": ["status", "budget"]
  },
  "timestamp": "2024-01-20T15:00:00Z"
}
```

## Versionamento

A API atualmente está na v1. Futuras versões serão indicadas no path:
- v1: `/api/...` (atual)
- v2: `/api/v2/...` (futuro)

## SDKs e Bibliotecas

### JavaScript/TypeScript
```typescript
import { NineTwoDashAPI } from '@ninetwodash/sdk';

const api = new NineTwoDashAPI({
  apiKey: 'sua-api-key',
  baseURL: 'https://api.ninetwodash.com'
});

const clients = await api.clients.list();
```

## Exemplos de Uso

### cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ninetwodash.com","password":"admin123"}'

# Listar clientes
curl http://localhost:3000/api/admin/clients \
  -H "Cookie: next-auth.session-token=..."

# Criar cliente
curl -X POST http://localhost:3000/api/admin/clients \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{"name":"Novo Cliente","email":"novo@cliente.com","monthlyBudget":5000}'
```

### JavaScript/Fetch

```javascript
// Login
const response = await fetch('/api/auth/signin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@ninetwodash.com',
    password: 'admin123'
  }),
  credentials: 'include'
});

// Listar clientes
const clients = await fetch('/api/admin/clients', {
  credentials: 'include'
}).then(res => res.json());

// Dashboard data
const dashboard = await fetch('/api/dashboard/client-123?period=30d', {
  credentials: 'include'
}).then(res => res.json());
```

## Melhores Práticas

1. **Sempre use HTTPS em produção**
2. **Implemente cache no cliente para dados que mudam pouco**
3. **Use paginação para listas grandes**
4. **Trate erros adequadamente**
5. **Respeite os rate limits**
6. **Mantenha tokens seguros**
7. **Valide dados no cliente antes de enviar**

## Suporte

Para dúvidas sobre a API:
- Documentação: Este documento
- Issues: GitHub do projeto
- Email: api@ninetwodash.com