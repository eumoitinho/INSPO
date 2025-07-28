# NineTwoDash - Dashboard de Marketing Digital

## Visão Geral

NineTwoDash é uma plataforma completa de dashboard para agências de marketing digital, permitindo o acompanhamento em tempo real de métricas de Google Ads, Facebook Ads e Google Analytics. O sistema oferece tanto um painel administrativo para gestão de clientes quanto portais individuais para cada cliente.

## Tecnologias Principais

### Frontend
- **Next.js 15.2.4** - Framework React com SSR/SSG
- **React 19** - Biblioteca de interface de usuário
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework de estilização
- **Radix UI** - Componentes de interface acessíveis
- **Recharts** - Biblioteca de gráficos
- **Lucide React** - Biblioteca de ícones

### Backend
- **Next.js API Routes** - Endpoints serverless
- **NextAuth.js** - Autenticação e autorização
- **MongoDB com Mongoose** - Banco de dados NoSQL
- **bcryptjs** - Criptografia de senhas

### Integrações
- **Google Ads API** - Dados de campanhas Google
- **Facebook Ads API** - Dados de campanhas Meta
- **Google Analytics Data API** - Métricas de analytics
- **Google APIs** - Serviços diversos do Google

## Arquitetura do Projeto

```
INSPO/
├── src/
│   ├── app/                    # App Router do Next.js
│   │   ├── admin/             # Páginas do painel administrativo
│   │   ├── portal/            # Portal do cliente
│   │   ├── api/               # API Routes
│   │   └── login/             # Página de autenticação
│   ├── components/            # Componentes React reutilizáveis
│   │   ├── ui/               # Componentes de UI base
│   │   └── providers/        # Context providers
│   ├── lib/                   # Utilitários e configurações
│   │   ├── auth.ts           # Configuração NextAuth
│   │   ├── mongodb.ts        # Modelos e conexão MongoDB
│   │   ├── encryption.ts     # Criptografia de dados
│   │   └── [integrations]    # APIs de terceiros
│   └── types/                 # Definições TypeScript
├── public/                    # Assets estáticos
├── hooks/                     # React hooks customizados
└── scripts/                   # Scripts utilitários
```

## Funcionalidades Principais

### Painel Administrativo
- **Dashboard**: Visão geral de todos os clientes
- **Gestão de Clientes**: CRUD completo de clientes
- **Integrações**: Configuração de APIs (Google Ads, Facebook Ads, GA4)
- **Relatórios**: Geração e visualização de relatórios
- **Financeiro**: Controle de orçamentos e gastos
- **Equipe**: Gestão de usuários e permissões

### Portal do Cliente
- **Dashboard Personalizado**: Métricas principais do cliente
- **Campanhas**: Visualização de campanhas ativas
- **Analytics**: Dados do Google Analytics
- **Gráficos Customizados**: Visualizações personalizadas
- **Relatórios**: Acesso a relatórios gerados

### Segurança
- Autenticação via NextAuth.js
- Criptografia de credenciais de API
- Controle de acesso baseado em roles (admin/client)
- Sessões JWT com expiração de 24 horas

## Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- MongoDB
- Conta de desenvolvedor Google (para Google Ads/Analytics)
- Conta de desenvolvedor Meta (para Facebook Ads)

### Passos de Instalação

1. **Clone o repositório**
```bash
git clone [url-do-repositorio]
cd INSPO
```

2. **Instale as dependências**
```bash
pnpm install
# ou
npm install
```

3. **Configure as variáveis de ambiente**
Crie um arquivo `.env.local` na raiz do projeto:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua-chave-secreta-aqui

# MongoDB
MONGODB_URI=mongodb://localhost:27017/ninetwodash

# Criptografia
ENCRYPTION_KEY=sua-chave-de-criptografia-32-chars

# Google APIs
GOOGLE_CLIENT_ID=seu-client-id
GOOGLE_CLIENT_SECRET=seu-client-secret

# Facebook/Meta APIs
FACEBOOK_APP_ID=seu-app-id
FACEBOOK_APP_SECRET=seu-app-secret

# Google Ads
GOOGLE_ADS_DEVELOPER_TOKEN=seu-developer-token
```

4. **Execute o projeto**
```bash
pnpm dev
# ou
npm run dev
```

O aplicativo estará disponível em `http://localhost:3000`

## Estrutura de Dados

### Modelos Principais

#### User
- Informações de autenticação
- Role (admin/client)
- Vínculo com cliente (se role=client)

#### Client
- Dados da empresa
- Configurações de integrações
- Credenciais criptografadas
- Configurações do portal

#### Campaign
- Dados de campanhas por plataforma
- Métricas diárias
- Status e performance

#### Report
- Relatórios gerados
- Dados agregados
- Gráficos e visualizações

## APIs Disponíveis

### Autenticação
- `POST /api/auth/[...nextauth]` - Endpoints NextAuth

### Admin APIs
- `GET/POST /api/admin/clients` - Gestão de clientes
- `GET/POST /api/admin/dashboard/stats` - Estatísticas do dashboard
- `POST /api/admin/clients/[clientId]/credentials` - Configurar credenciais

### Integrações
- `GET /api/google-ads/[clientId]` - Dados Google Ads
- `GET /api/facebook-ads/[clientId]` - Dados Facebook Ads
- `GET /api/analytics/[clientId]` - Dados Google Analytics

### Portal APIs
- `GET /api/dashboard/[clientId]` - Dashboard do cliente
- `GET /api/campaigns/[clientId]` - Campanhas do cliente
- `GET /api/reports/[clientId]` - Relatórios do cliente

## Desenvolvimento

### Estrutura de Componentes

O projeto utiliza uma arquitetura baseada em componentes com:
- **Componentes de UI**: Elementos base reutilizáveis
- **Componentes de Domínio**: Lógica específica de negócio
- **Layouts**: Estruturas de página compartilhadas

### Padrões de Código

- **TypeScript**: Tipagem forte em todo o projeto
- **Componentes Funcionais**: Uso de hooks do React
- **Server Components**: Aproveitamento do Next.js 15
- **API Routes**: Endpoints serverless otimizados

### Scripts Disponíveis

```bash
pnpm dev        # Desenvolvimento local
pnpm build      # Build de produção
pnpm start      # Executar build de produção
pnpm lint       # Verificar código com ESLint
```

## Deployment

### Requisitos de Produção
- Node.js 18+
- MongoDB Atlas ou instância MongoDB
- Variáveis de ambiente configuradas
- SSL/TLS para produção

### Plataformas Recomendadas
- **Vercel**: Deploy otimizado para Next.js
- **Railway**: Full-stack com MongoDB
- **Render**: Alternativa com bom custo-benefício

## Segurança

### Boas Práticas Implementadas
- Criptografia AES-256 para credenciais
- Validação de entrada em todas as APIs
- Rate limiting nas rotas sensíveis
- Logs de atividade para auditoria
- Sessões seguras com JWT

### Recomendações
- Use senhas fortes para contas admin
- Rotacione o NEXTAUTH_SECRET regularmente
- Mantenha as dependências atualizadas
- Configure CORS adequadamente
- Use HTTPS em produção

## Manutenção

### Monitoramento
- Logs de erro centralizados
- Métricas de performance
- Alertas de falha de integração
- Backup regular do MongoDB

### Atualizações
- Verifique updates de segurança mensalmente
- Teste integrações após updates de API
- Mantenha documentação atualizada

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Suporte

Para questões e suporte:
- Abra uma issue no GitHub
- Contate o time de desenvolvimento
- Consulte a documentação das APIs integradas

## Licença

Este projeto é proprietário e confidencial. Todos os direitos reservados.

---

Desenvolvido com ❤️ pela equipe Catalisti