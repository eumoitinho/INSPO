# Guia de Desenvolvimento e Contribuição - NineTwoDash

## Índice
1. [Configuração do Ambiente de Desenvolvimento](#configuração-do-ambiente-de-desenvolvimento)
2. [Estrutura e Convenções de Código](#estrutura-e-convenções-de-código)
3. [Fluxo de Desenvolvimento](#fluxo-de-desenvolvimento)
4. [Testes](#testes)
5. [Git Workflow](#git-workflow)
6. [Code Review](#code-review)
7. [Deployment](#deployment)
8. [Debugging e Troubleshooting](#debugging-e-troubleshooting)

## Configuração do Ambiente de Desenvolvimento

### Ferramentas Recomendadas

#### IDE/Editor
- **VS Code** (recomendado) com extensões:
  - ESLint
  - Prettier
  - TypeScript Vue Plugin
  - Tailwind CSS IntelliSense
  - GitLens
  - MongoDB for VS Code

#### Outras Ferramentas
- **MongoDB Compass**: GUI para MongoDB
- **Postman/Insomnia**: Teste de APIs
- **React Developer Tools**: Extensão do navegador
- **Redux DevTools**: Para debugging de estado

### Configuração do VS Code

`.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### Scripts de Desenvolvimento

```bash
# Desenvolvimento com hot reload
pnpm dev

# Desenvolvimento com debug
NODE_OPTIONS='--inspect' pnpm dev

# Typecheck em tempo real
pnpm typecheck --watch

# Lint em tempo real
pnpm lint --watch
```

## Estrutura e Convenções de Código

### Estrutura de Pastas

```
src/
├── app/                    # Next.js App Router
│   ├── (routes)/          # Grupos de rotas
│   ├── api/               # API endpoints
│   └── _components/       # Componentes específicos da rota
├── components/            # Componentes compartilhados
│   ├── ui/               # Componentes de UI base
│   ├── forms/            # Componentes de formulário
│   └── charts/           # Componentes de visualização
├── lib/                   # Bibliotecas e utilitários
│   ├── api/              # Funções de API client
│   ├── db/               # Queries e models
│   └── utils/            # Funções utilitárias
├── hooks/                 # React hooks customizados
├── types/                 # TypeScript types/interfaces
└── styles/               # Estilos globais
```

### Convenções de Nomenclatura

#### Arquivos e Pastas
- **Componentes**: PascalCase (`UserProfile.tsx`)
- **Utilitários**: camelCase (`formatDate.ts`)
- **Tipos**: PascalCase (`User.types.ts`)
- **Hooks**: camelCase com prefixo `use` (`useAuth.ts`)
- **API Routes**: kebab-case (`user-profile/route.ts`)

#### Código
```typescript
// Interfaces/Types
interface UserProfile {
  id: string;
  name: string;
}

// Componentes
export function UserCard({ user }: { user: UserProfile }) {
  return <div>{user.name}</div>;
}

// Hooks
export function useUserData(userId: string) {
  // ...
}

// Constantes
const MAX_RETRY_ATTEMPTS = 3;
const API_ENDPOINTS = {
  USERS: '/api/users',
  POSTS: '/api/posts',
};
```

### Padrões de Código

#### TypeScript
```typescript
// Sempre use tipos explícitos
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Prefira interfaces sobre types para objetos
interface User {
  id: string;
  name: string;
  email: string;
}

// Use enums para constantes relacionadas
enum UserRole {
  Admin = 'admin',
  Client = 'client',
  Guest = 'guest',
}

// Use generics quando apropriado
function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  // ...
}
```

#### React/Next.js
```typescript
// Server Components (padrão no App Router)
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// Client Components
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// Props com children
interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

// Memoização quando necessário
const ExpensiveComponent = memo(({ data }: Props) => {
  const processed = useMemo(() => processData(data), [data]);
  return <div>{processed}</div>;
});
```

#### API Routes
```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validação com Zod
const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createUserSchema.parse(body);
    
    // Lógica de criação
    const user = await createUser(validated);
    
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
```

### Estilização

#### Tailwind CSS
```tsx
// Use clsx para classes condicionais
import { clsx } from 'clsx';

function Button({ variant, className, ...props }) {
  return (
    <button
      className={clsx(
        'px-4 py-2 rounded font-medium transition-colors',
        {
          'bg-blue-500 text-white hover:bg-blue-600': variant === 'primary',
          'bg-gray-200 text-gray-800 hover:bg-gray-300': variant === 'secondary',
        },
        className
      )}
      {...props}
    />
  );
}

// Componentes com variantes usando CVA
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input hover:bg-accent',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
```

## Fluxo de Desenvolvimento

### 1. Planejamento
- Discuta a feature/bug na issue
- Defina os requisitos claramente
- Quebre em tarefas menores se necessário

### 2. Desenvolvimento
```bash
# Crie uma branch da develop
git checkout develop
git pull origin develop
git checkout -b feature/nome-da-feature

# Desenvolva incrementalmente
# Commite frequentemente com mensagens descritivas
git add .
git commit -m "feat: adiciona validação de email no formulário de login"

# Mantenha a branch atualizada
git fetch origin
git rebase origin/develop
```

### 3. Testes Locais
```bash
# Execute os testes
pnpm test

# Verifique o lint
pnpm lint

# Verifique tipos
pnpm typecheck

# Teste a build
pnpm build
```

### 4. Push e Pull Request
```bash
# Push da branch
git push origin feature/nome-da-feature

# Crie um Pull Request pelo GitHub
```

## Testes

### Estrutura de Testes
```
__tests__/
├── unit/              # Testes unitários
├── integration/       # Testes de integração
└── e2e/              # Testes end-to-end

src/
└── components/
    └── Button/
        ├── Button.tsx
        └── Button.test.tsx  # Teste ao lado do componente
```

### Escrevendo Testes

#### Testes Unitários
```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### Testes de API
```typescript
// api.test.ts
import { createMocks } from 'node-mocks-http';
import { POST } from '@/app/api/users/route';

describe('/api/users', () => {
  it('creates a user with valid data', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toHaveProperty('id');
    expect(data.name).toBe('John Doe');
  });
});
```

## Git Workflow

### Branches
- `main`: Produção
- `develop`: Desenvolvimento
- `feature/*`: Novas funcionalidades
- `bugfix/*`: Correções de bugs
- `hotfix/*`: Correções urgentes em produção

### Commit Messages
Siga o padrão Conventional Commits:

```
tipo(escopo): descrição curta

[corpo opcional]

[rodapé opcional]
```

Tipos:
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação (sem mudança de lógica)
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Tarefas de manutenção

Exemplos:
```bash
git commit -m "feat(auth): adiciona autenticação dois fatores"
git commit -m "fix(dashboard): corrige cálculo de ROI"
git commit -m "docs: atualiza README com novas instruções de instalação"
```

### Pull Request Template
```markdown
## Descrição
Breve descrição do que foi feito

## Tipo de mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Como testar
1. Passo 1
2. Passo 2

## Checklist
- [ ] Código segue os padrões do projeto
- [ ] Testes foram adicionados/atualizados
- [ ] Documentação foi atualizada
- [ ] Sem warnings do lint
```

## Code Review

### Para Reviewers
- Verifique se o código segue os padrões
- Teste a funcionalidade localmente
- Sugira melhorias construtivamente
- Aprove apenas quando estiver satisfeito

### Para Desenvolvedores
- Responda todos os comentários
- Faça as alterações solicitadas
- Explique decisões de design quando necessário
- Seja receptivo ao feedback

## Deployment

### Ambientes
- **Development**: Branch `develop` (auto-deploy)
- **Staging**: Tags `staging-*`
- **Production**: Branch `main`

### Processo de Deploy
```bash
# Para staging
git tag staging-v1.2.3
git push origin staging-v1.2.3

# Para produção (após aprovação)
git checkout main
git merge develop
git push origin main
```

### Variáveis de Ambiente
Sempre adicione novas variáveis em:
1. `.env.example`
2. Documentação
3. Todos os ambientes de deploy

## Debugging e Troubleshooting

### Debug no VS Code
`.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "pnpm dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Logs e Monitoramento
```typescript
// Use o logger customizado
import { logger } from '@/lib/logger';

logger.info('Usuário autenticado', { userId: user.id });
logger.error('Erro ao conectar API', { error, platform: 'google_ads' });

// Em desenvolvimento, use console com contexto
if (process.env.NODE_ENV === 'development') {
  console.log('[Auth]', 'Token expirado', { token });
}
```

### Problemas Comuns

#### "Module not found"
```bash
# Limpe o cache
rm -rf .next node_modules
pnpm install
pnpm dev
```

#### Types não reconhecidos
```bash
# Regenere os types
pnpm typecheck
```

#### Erro de CORS em desenvolvimento
```typescript
// next.config.mjs
export default {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
};
```

## Performance

### Otimizações
- Use `dynamic` imports para code splitting
- Implemente `loading.tsx` para melhor UX
- Use `Image` component do Next.js
- Minimize re-renders com `memo` e `useMemo`

### Monitoramento
```typescript
// Measure performance
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log('Page load time:', pageLoadTime);
  });
}
```

## Recursos Úteis

### Documentação
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Comunidade
- Slack interno: #ninetwodash-dev
- GitHub Discussions
- Stack Overflow tag: `ninetwodash`

---

**Dúvidas?** Abra uma issue ou contate a equipe de desenvolvimento.