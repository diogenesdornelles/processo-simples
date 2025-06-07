# TanStack Query Hooks

Este diretório contém todos os hooks TanStack Query organizados por métodos HTTP para gerenciar o estado da aplicação e comunicação com a API.

## Estrutura

```
services/
├── get/          # Hooks para operações de leitura (GET)
├── post/         # Hooks para operações de criação (POST)
├── put/          # Hooks para operações de atualização (PUT)
├── delete/       # Hooks para operações de remoção (DELETE)
└── index.ts      # Exporta todos os hooks
```

## Hooks Disponíveis

### 🔍 GET Hooks (Leitura)
- `useGetAllUsers()` - Lista todos os usuários
- `useGetUser(id, enabled?)` - Busca um usuário específico
- `useGetAllProcs()` - Lista todos os processos
- `useGetProc(id, enabled?)` - Busca um processo específico
- `useGetAllEvents()` - Lista todos os eventos
- `useGetEvent(id, enabled?)` - Busca um evento específico
- `useGetAllDocs()` - Lista todos os documentos
- `useGetDoc(id, enabled?)` - Busca um documento específico
- `useGetMe()` - Busca dados do usuário autenticado

### ➕ POST Hooks (Criação)
- `useCreateUser()` - Cria um novo usuário
- `useCreateProc()` - Cria um novo processo
- `useCreateEvent()` - Cria um novo evento
- `useCreateDoc()` - Cria um novo documento
- `useLogin()` - Realiza login
- `useLogout()` - Realiza logout

### ✏️ PUT Hooks (Atualização)
- `useUpdateUser()` - Atualiza um usuário
- `useUpdateProc()` - Atualiza um processo
- `useUpdateEvent()` - Atualiza um evento
- `useUpdateDoc()` - Atualiza um documento

### 🗑️ DELETE Hooks (Remoção)
- `useDeleteUser()` - Remove um usuário
- `useDeleteProc()` - Remove um processo
- `useDeleteEvent()` - Remove um evento
- `useDeleteDoc()` - Remove um documento

## Exemplos de Uso

### Leitura de Dados
```tsx
import { useGetAllProcs, useGetProc } from '@/services';

function ProcsList() {
  const { data: procs, isLoading, error } = useGetAllProcs();
  
  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar processos</div>;
  
  return (
    <div>
      {procs?.map(proc => (
        <div key={proc.id}>{proc.title}</div>
      ))}
    </div>
  );
}

function ProcDetail({ id }: { id: string }) {
  const { data: proc } = useGetProc(id);
  
  return <div>{proc?.title}</div>;
}
```

### Criação de Dados
```tsx
import { useCreateProc } from '@/services';

function CreateProcForm() {
  const createProc = useCreateProc();
  
  const handleSubmit = (data: CreateProc) => {
    createProc.mutate(data, {
      onSuccess: () => {
        console.log('Processo criado com sucesso!');
      },
      onError: (error) => {
        console.error('Erro ao criar processo:', error);
      }
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* campos do formulário */}
    </form>
  );
}
```

### Atualização de Dados
```tsx
import { useUpdateProc } from '@/services';

function EditProcForm({ id }: { id: string }) {
  const updateProc = useUpdateProc();
  
  const handleSubmit = (data: UpdateProc) => {
    updateProc.mutate({ id, proc: data }, {
      onSuccess: () => {
        console.log('Processo atualizado com sucesso!');
      }
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* campos do formulário */}
    </form>
  );
}
```

### Remoção de Dados
```tsx
import { useDeleteProc } from '@/services';

function DeleteProcButton({ id }: { id: string }) {
  const deleteProc = useDeleteProc();
  
  const handleDelete = () => {
    if (confirm('Tem certeza que deseja remover este processo?')) {
      deleteProc.mutate(id, {
        onSuccess: () => {
          console.log('Processo removido com sucesso!');
        }
      });
    }
  };
  
  return (
    <button onClick={handleDelete} disabled={deleteProc.isPending}>
      {deleteProc.isPending ? 'Removendo...' : 'Remover'}
    </button>
  );
}
```

### Autenticação
```tsx
import { useLogin, useLogout, useGetMe } from '@/services';

function AuthExample() {
  const login = useLogin();
  const logout = useLogout();
  const { data: user } = useGetMe();
  
  const handleLogin = (credentials: LoginCredentials) => {
    login.mutate(credentials, {
      onSuccess: (data) => {
        localStorage.setItem('token', data.token);
        console.log('Login realizado com sucesso!');
      }
    });
  };
  
  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        localStorage.removeItem('token');
        console.log('Logout realizado com sucesso!');
      }
    });
  };
  
  return (
    <div>
      {user ? (
        <div>
          <p>Bem-vindo, {user.name}!</p>
          <button onClick={handleLogout}>Sair</button>
        </div>
      ) : (
        <LoginForm onSubmit={handleLogin} />
      )}
    </div>
  );
}
```

## Recursos dos Hooks

### Cache Automático
- Todos os hooks GET utilizam cache automático do TanStack Query
- Os dados são atualizados automaticamente quando necessário

### Invalidação Inteligente
- Hooks de mutação (POST/PUT/DELETE) invalidam automaticamente os caches relacionados
- Garante que os dados estejam sempre atualizados na interface

### Loading States
- Todos os hooks fornecem estados de loading para melhor UX
- `isLoading`, `isPending`, `isSuccess`, `isError`

### Error Handling
- Tratamento de erros padronizado em todos os hooks
- Integração com o sistema de interceptação de erros da API

### Otimistic Updates
- Alguns hooks podem ser configurados para atualizações otimistas
- Melhora a percepção de performance da aplicação

## Configuração Query Keys

Os query keys seguem um padrão consistente:
```
[entidade, método, ...parâmetros]
```

Exemplos:
- `['user', 'getAll']` - Lista de usuários
- `['user', 'get', id]` - Usuário específico
- `['proc', 'getAll']` - Lista de processos
- `['auth', 'me']` - Dados do usuário autenticado
