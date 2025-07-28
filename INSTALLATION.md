# Guia de Instalação e Configuração - NineTwoDash

## Índice
1. [Requisitos do Sistema](#requisitos-do-sistema)
2. [Instalação Local](#instalação-local)
3. [Configuração do Ambiente](#configuração-do-ambiente)
4. [Configuração do MongoDB](#configuração-do-mongodb)
5. [Configuração das APIs](#configuração-das-apis)
6. [Primeiro Acesso](#primeiro-acesso)
7. [Troubleshooting](#troubleshooting)

## Requisitos do Sistema

### Software Necessário
- **Node.js**: v18.0.0 ou superior
- **pnpm**: v8.0.0 ou superior (recomendado) ou npm/yarn
- **MongoDB**: v5.0 ou superior
- **Git**: Para clonar o repositório

### Requisitos de Hardware (Desenvolvimento)
- **RAM**: Mínimo 4GB, recomendado 8GB
- **Armazenamento**: 2GB livres
- **Processador**: Dual-core ou superior

### Requisitos de Hardware (Produção)
- **RAM**: Mínimo 8GB, recomendado 16GB
- **Armazenamento**: 20GB livres (incluindo logs e backups)
- **Processador**: Quad-core ou superior
- **Rede**: Conexão estável com baixa latência

## Instalação Local

### 1. Clonar o Repositório

```bash
# Via HTTPS
git clone https://github.com/sua-organizacao/ninetwodash.git

# Via SSH
git clone git@github.com:sua-organizacao/ninetwodash.git

# Entrar no diretório
cd ninetwodash
```

### 2. Instalar Dependências

```bash
# Usando pnpm (recomendado)
pnpm install

# Usando npm
npm install

# Usando yarn
yarn install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:

```env
# ===================================
# CONFIGURAÇÕES GERAIS
# ===================================

# URL da aplicação (desenvolvimento)
NEXTAUTH_URL=http://localhost:3000

# URL da aplicação (produção)
# NEXTAUTH_URL=https://seu-dominio.com

# ===================================
# AUTENTICAÇÃO (NextAuth.js)
# ===================================

# Chave secreta para JWT (gere uma chave segura)
# Comando para gerar: openssl rand -base64 32
NEXTAUTH_SECRET=sua-chave-secreta-super-segura-aqui

# ===================================
# BANCO DE DADOS
# ===================================

# MongoDB URI (desenvolvimento)
MONGODB_URI=mongodb://localhost:27017/ninetwodash

# MongoDB URI (produção - exemplo com MongoDB Atlas)
# MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/ninetwodash?retryWrites=true&w=majority

# ===================================
# CRIPTOGRAFIA
# ===================================

# Chave de criptografia AES-256 (32 caracteres)
# IMPORTANTE: Use uma chave forte e única
ENCRYPTION_KEY=32-caracteres-chave-super-segura

# ===================================
# GOOGLE APIs
# ===================================

# OAuth2 para Google (usado para Google Ads e Analytics)
GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret

# Google Ads API
GOOGLE_ADS_DEVELOPER_TOKEN=seu-developer-token
GOOGLE_ADS_CLIENT_CUSTOMER_ID=123-456-7890

# ===================================
# FACEBOOK/META APIs
# ===================================

# Facebook App (para Facebook Ads)
FACEBOOK_APP_ID=seu-app-id
FACEBOOK_APP_SECRET=seu-app-secret
FACEBOOK_REDIRECT_URI=http://localhost:3000/api/auth/facebook-ads/callback

# ===================================
# CONFIGURAÇÕES OPCIONAIS
# ===================================

# Ambiente (development/staging/production)
NODE_ENV=development

# Porta do servidor (padrão: 3000)
PORT=3000

# Logs
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Email (para notificações)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app
EMAIL_FROM=noreply@ninetwodash.com
```

## Configuração do MongoDB

### Opção 1: MongoDB Local

1. **Instalar MongoDB**
   - Windows: Baixe o instalador em [mongodb.com](https://www.mongodb.com/try/download/community)
   - macOS: `brew install mongodb-community`
   - Linux: Siga o guia oficial para sua distribuição

2. **Iniciar o MongoDB**
```bash
# Windows (como serviço)
net start MongoDB

# macOS/Linux
mongod --dbpath /path/to/data/directory
```

3. **Criar banco de dados**
```bash
# Conectar ao MongoDB
mongosh

# Criar banco e usuário (opcional)
use ninetwodash
db.createUser({
  user: "ninetwoadmin",
  pwd: "senha-segura",
  roles: [{ role: "readWrite", db: "ninetwodash" }]
})
```

### Opção 2: MongoDB Atlas (Cloud)

1. **Criar conta** em [cloud.mongodb.com](https://cloud.mongodb.com)

2. **Criar um cluster gratuito**
   - Escolha a região mais próxima
   - Selecione o plano gratuito (M0)

3. **Configurar acesso**
   - Adicione seu IP na whitelist
   - Crie um usuário do banco

4. **Obter connection string**
   - Clique em "Connect" no cluster
   - Escolha "Connect your application"
   - Copie a string e adicione ao `.env.local`

## Configuração das APIs

### Google Cloud Platform

1. **Criar projeto** no [Google Cloud Console](https://console.cloud.google.com)

2. **Habilitar APIs necessárias**:
   - Google Ads API
   - Google Analytics Data API
   - Google Analytics Admin API

3. **Criar credenciais OAuth2**:
   ```
   APIs e serviços > Credenciais > Criar credenciais > ID do cliente OAuth
   - Tipo: Aplicativo da Web
   - URIs de redirecionamento autorizados:
     - http://localhost:3000/api/auth/google-ads/callback
     - http://localhost:3000/api/auth/google-analytics/callback
   ```

4. **Google Ads Developer Token**:
   - Acesse o [Google Ads API Center](https://ads.google.com/aw/apicenter)
   - Solicite um token de desenvolvedor
   - Adicione ao `.env.local`

### Facebook/Meta Business

1. **Criar App** no [Facebook Developers](https://developers.facebook.com)

2. **Configurar o App**:
   - Adicione o produto "Facebook Login"
   - Configure URLs de redirecionamento:
     - http://localhost:3000/api/auth/facebook-ads/callback

3. **Permissões necessárias**:
   - ads_management
   - ads_read
   - business_management

4. **Gerar token de acesso**:
   - Use o Graph API Explorer
   - Solicite um token de longa duração

## Primeiro Acesso

### 1. Iniciar a Aplicação

```bash
# Desenvolvimento
pnpm dev

# Produção
pnpm build
pnpm start
```

### 2. Acessar a Aplicação

Abra o navegador em: `http://localhost:3000`

### 3. Login Inicial

Use uma das credenciais padrão de desenvolvimento:
- Email: `admin@ninetwodash.com`
- Senha: `admin123`

**IMPORTANTE**: Altere essas credenciais em produção!

### 4. Configuração Inicial

1. **Criar primeiro cliente**:
   - Acesse Admin > Clientes
   - Clique em "Novo Cliente"
   - Preencha os dados básicos

2. **Configurar integrações**:
   - Acesse Admin > Integrações
   - Configure as APIs conforme necessário

3. **Testar conexões**:
   - Use os botões de teste em cada integração
   - Verifique os logs em caso de erro

## Scripts Úteis

```bash
# Desenvolvimento com hot reload
pnpm dev

# Build de produção
pnpm build

# Iniciar servidor de produção
pnpm start

# Verificar código (linting)
pnpm lint

# Executar scripts de manutenção
node scripts/fix-client-slugs.js

# Limpar cache e node_modules
rm -rf .next node_modules
pnpm install
```

## Configuração de Produção

### 1. Variáveis de Ambiente

Certifique-se de atualizar todas as variáveis para valores de produção:
- URLs devem usar HTTPS
- Chaves secretas devem ser únicas e seguras
- Desabilite logs de debug

### 2. Build Otimizado

```bash
# Build otimizado
NODE_ENV=production pnpm build

# Verificar o build
pnpm start
```

### 3. Process Manager

Use PM2 para gerenciar o processo:

```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicação
pm2 start npm --name "ninetwodash" -- start

# Configurar auto-start
pm2 startup
pm2 save
```

### 4. Nginx (Proxy Reverso)

Exemplo de configuração:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Troubleshooting

### Problema: "Cannot connect to MongoDB"

**Soluções**:
1. Verifique se o MongoDB está rodando
2. Confirme a MONGODB_URI no `.env.local`
3. Teste a conexão: `mongosh sua-connection-string`

### Problema: "Google Ads API error"

**Soluções**:
1. Verifique o developer token
2. Confirme que a API está habilitada no GCP
3. Verifique os logs detalhados no console

### Problema: "Build failing"

**Soluções**:
1. Limpe o cache: `rm -rf .next`
2. Reinstale dependências: `rm -rf node_modules && pnpm install`
3. Verifique versão do Node.js

### Problema: "Authentication not working"

**Soluções**:
1. Verifique NEXTAUTH_SECRET
2. Confirme NEXTAUTH_URL
3. Limpe cookies do navegador
4. Verifique logs do servidor

## Segurança em Produção

### Checklist de Segurança

- [ ] Alterar todas as senhas padrão
- [ ] Configurar HTTPS/SSL
- [ ] Habilitar CORS adequadamente
- [ ] Configurar firewall
- [ ] Implementar rate limiting
- [ ] Configurar backups automáticos
- [ ] Monitorar logs de segurança
- [ ] Manter dependências atualizadas

### Backup do MongoDB

```bash
# Backup manual
mongodump --uri="sua-mongodb-uri" --out=/backup/$(date +%Y%m%d)

# Restore
mongorestore --uri="sua-mongodb-uri" /backup/20240120
```

## Monitoramento

### Logs da Aplicação

```bash
# Ver logs em tempo real (PM2)
pm2 logs ninetwodash

# Ver logs específicos
pm2 logs ninetwodash --lines 100
```

### Métricas de Performance

```bash
# Monitor PM2
pm2 monit

# Status dos processos
pm2 status
```

## Suporte

Se encontrar problemas:

1. Verifique este guia de troubleshooting
2. Consulte os logs da aplicação
3. Abra uma issue no repositório
4. Contate o suporte técnico

---

**Última atualização**: Janeiro 2025