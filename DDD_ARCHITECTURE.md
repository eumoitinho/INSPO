# Arquitetura DDD - NineTwoDash

## 🏗️ Visão Geral

O NineTwoDash foi reestruturado seguindo Domain-Driven Design (DDD) com arquitetura modular monorepo. Esta abordagem proporciona:

- **Separação clara de responsabilidades** entre domínios
- **Desenvolvimento independente** por módulo
- **Reusabilidade** de código entre projetos
- **Manutenibilidade** aprimorada
- **Suporte para IA** com contextos estruturados

## 📁 Estrutura do Projeto

```
ninetwodash/
├── apps/                           # Aplicações
│   └── web/                       # Next.js app principal
│       ├── src/                   # Código fonte
│       ├── public/                # Assets públicos
│       └── package.json           # @ninetwodash/web
│
├── packages/                      # Pacotes compartilhados
│   ├── ui/                       # Design system (@ninetwodash/ui)
│   │   └── src/                  # Componentes Radix UI
│   ├── shared/                   # Utils e types (@ninetwodash/shared)
│   │   └── src/
│   │       ├── types/            # TypeScript types
│   │       └── utils/            # Funções utilitárias
│   └── config/                   # Configurações compartilhadas
│
├── modules/                      # Domínios DDD
│   ├── auth/                    # Autenticação e autorização
│   ├── clients/                 # Gestão de clientes
│   ├── campaigns/               # Campanhas publicitárias
│   ├── analytics/               # Analytics e métricas
│   ├── integrations/            # APIs externas
│   └── dashboard/               # Dashboard e relatórios
│
├── infrastructure/              # Infraestrutura compartilhada
│   ├── database/               # MongoDB, models, migrations
│   ├── cache/                  # Sistema de cache
│   ├── monitoring/             # Logs e observabilidade
│   └── security/               # Segurança transversal
│
├── scripts/                    # Scripts de desenvolvimento
│   ├── context-tools.js       # Ferramentas IA
│   └── update-imports.js      # Migração de imports
│
├── tools/                      # Ferramentas
│   └── ia-templates/          # Templates para IA
│
└── docs/                       # Documentação
```

## 🧩 Módulos DDD

### Estrutura Padrão de Módulo

Cada módulo segue a mesma estrutura em camadas:

```
modules/[nome]/
├── .context.md                    # Contexto para IA
├── package.json                   # Configuração do módulo
├── tsconfig.json                  # TypeScript config
├── domain/                        # Camada de domínio
│   ├── entities/                 # Entidades de negócio
│   ├── value-objects/            # Objetos de valor
│   └── services/                 # Serviços de domínio
├── application/                   # Camada de aplicação
│   ├── use-cases/                # Casos de uso
│   ├── dtos/                     # Data Transfer Objects
│   └── ports/                    # Interfaces (contratos)
├── infrastructure/                # Camada de infraestrutura
│   ├── repositories/             # Implementação de repositórios
│   ├── adapters/                 # Adaptadores externos
│   └── config/                   # Configurações
└── presentation/                  # Camada de apresentação
    ├── pages/                    # Páginas Next.js
    ├── api/                      # API routes
    ├── components/               # Componentes React
    └── hooks/                    # React hooks
```

### Módulos Implementados

#### 🔐 Auth (`@ninetwodash/auth`)
- **Responsabilidades**: Autenticação, autorização, sessões
- **Principais componentes**:
  - `User` entity com roles (admin/client)
  - `EncryptionService` para segurança
  - `SignInUseCase` com validação Zod
  - Integração NextAuth configurada

#### 👥 Clients (`@ninetwodash/clients`)
- **Responsabilidades**: CRUD clientes, credenciais, portais
- **Principais componentes**:
  - `Client` aggregate com portal settings
  - `Budget` value object
  - `SlugService` para URLs únicas
  - `CreateClientUseCase` com geração de senha

#### 📊 Campaigns (`@ninetwodash/campaigns`)
- **Responsabilidades**: Sincronização de campanhas, métricas
- **Principais componentes**:
  - `Campaign` entity com cálculo de KPIs
  - `DateRange` value object
  - `SyncCampaignsUseCase` para atualização
  - Platform adapters interface

#### 📈 Analytics (`@ninetwodash/analytics`)
- **Responsabilidades**: Google Analytics 4, métricas de tráfego
- **Status**: Context definido, aguardando implementação

#### 🔌 Integrations (`@ninetwodash/integrations`)
- **Responsabilidades**: OAuth, APIs externas, tokens
- **Principais componentes**:
  - `Integration` entity com status
  - `GoogleAdsAdapter` implementado
  - Token refresh automático

#### 📱 Dashboard (`@ninetwodash/dashboard`)
- **Responsabilidades**: Agregação de dados, visualizações
- **Status**: Context definido, aguardando implementação

## 🛠️ Ferramentas de Desenvolvimento

### Context Tools (`scripts/context-tools.js`)

Ferramenta CLI para trabalhar com contextos de IA:

```bash
# Analisar estrutura de um módulo
node scripts/context-tools.js analyze modules/auth

# Comprimir contexto para IA
node scripts/context-tools.js compress modules/clients

# Gerar .context.md inicial
node scripts/context-tools.js generate modules/new-module
```

### Update Imports (`scripts/update-imports.js`)

Atualiza imports antigos para nova estrutura:

```bash
# Atualizar imports em apps/web
node scripts/update-imports.js apps/web/src

# Atualizar módulo específico
node scripts/update-imports.js modules/dashboard
```

### Templates IA (`tools/ia-templates/`)

Templates prontos para usar com IA:
- `code-gen.prompt` - Geração de código
- `refactor.prompt` - Refatoração
- `test-gen.prompt` - Geração de testes
- `migration.prompt` - Migração de código

## 🚀 Comandos Principais

```bash
# Desenvolvimento
pnpm dev                    # Inicia dev server

# Build
pnpm build                  # Build completo
pnpm build:packages         # Build só packages
pnpm build:modules          # Build só módulos

# Ferramentas
pnpm update-imports         # Atualiza imports
pnpm analyze [module]       # Analisa módulo
pnpm compress [module]      # Comprime contexto

# Qualidade
pnpm typecheck             # Verifica tipos
pnpm lint                  # Linting
```

## 📝 Convenções

### Nomenclatura
- **Entidades**: PascalCase (`UserEntity`, `ClientEntity`)
- **Use Cases**: PascalCase + UseCase (`SignInUseCase`)
- **Value Objects**: PascalCase + VO (`BudgetVO`)
- **Repositories**: Interface + Implementation (`IUserRepository`, `UserRepository`)

### Imports
```typescript
// Módulos internos
import { User } from '@ninetwodash/auth'
import { Client } from '@ninetwodash/clients'

// UI components
import { Button } from '@ninetwodash/ui/button'

// Shared utilities
import { formatDate } from '@ninetwodash/shared/utils'

// Infrastructure
import { connectToDatabase } from '@/infrastructure/database/mongodb/client'
```

### Validação
Sempre use Zod para validação de DTOs:
```typescript
export const CreateUserDTO = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2)
})
```

## 🔄 Workflow com IA

1. **Preparar contexto**:
   ```bash
   node scripts/context-tools.js compress modules/clients
   ```

2. **Usar template apropriado**:
   - Copie template de `tools/ia-templates/`
   - Substitua variáveis ({{MODULE_NAME}}, etc)

3. **Gerar com IA**:
   - Use o contexto comprimido + template
   - Revise o código gerado

4. **Validar**:
   ```bash
   pnpm typecheck
   pnpm test modules/clients
   ```

## 🎯 Benefícios da Arquitetura

### Modularidade
- Cada módulo é independente
- Deploy granular possível
- Teams podem trabalhar isoladamente

### Escalabilidade
- Adicionar novos domínios é trivial
- Performance otimizada com lazy loading
- Cache estratégico por módulo

### Manutenibilidade
- Código organizado por domínio
- Testes focados por módulo
- Documentação viva (.context.md)

### Desenvolvimento com IA
- Contextos estruturados facilitam prompts
- Templates garantem consistência
- Reduz tempo de onboarding

## 📚 Próximos Passos

1. **Completar módulos restantes**:
   - Dashboard (agregação de dados)
   - Analytics (GA4 completo)
   - Finalizar integrations

2. **Adicionar testes**:
   - Unit tests por módulo
   - Integration tests
   - E2E tests críticos

3. **Implementar features**:
   - Cache distribuído
   - WebSocket para real-time
   - Export de relatórios

4. **Documentar APIs**:
   - OpenAPI/Swagger
   - Postman collections
   - Exemplos de uso

## 🤝 Contribuindo

1. Sempre atualize `.context.md` ao modificar um módulo
2. Use os scripts de análise antes de commits grandes
3. Siga as convenções de nomenclatura
4. Adicione testes para novos use cases
5. Documente decisões arquiteturais importantes

---

*Arquitetura implementada seguindo princípios DDD para máxima modularidade e manutenibilidade.*