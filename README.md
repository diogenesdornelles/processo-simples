# Trabalho de Desenvolvimento de Interfaces WEB


## Gerenciador Simples de Processos


### Funcionalidades
- Autenticação de usuário
- Permite ver, incluir, alterar e excluir: **processo, evento e usuário**
- Permite ver, incluir e excluir: **documento**


---


## Stack Tecnológica


- **Backend:** PHP/Laravel ou Node.js
- **Frontend:** Next.js / React com Vite
- **Banco de dados:** PostgreSQL


---


## Modelo Entidade-Relacionamento (MER)


### processo
- `id` (int) (NOT NULL) (PK) (não pode sofrer update)
- `numero` (varchar(20)) (NOT NULL) (gerado sequencialmente, a partir de 10000000000000000000) (UNIQUE) (não pode sofrer update)
- `usuario_id` (int) (NOT NULL) (REFERENCES usuario.id ON DELETE RESTRICT ON UPDATE CASCADE) (não pode sofrer update)
- `proprietario` (text) (NOT NULL)
- `descricao` (text) (NULLABLE)
- `status` (enum: "Aberto", "Em Andamento", "Pendente", "Concluído", "Cancelado") (DEFAULT "Aberto")
- `prioridade` (enum: "Alta", "Média", "Baixa")
- `prazo` (timestamp) (NOT NULL)
- `ativo` (boolean) (NOT NULL) (DEFAULT true)
- `criado_em` (timestamp) (NOT NULL) (DEFAULT NOW) (não pode sofrer update)
- `alterado_em` (timestamp) (NOT NULL) (DEFAULT NOW)


---


### evento
- `id` (int) (NOT NULL) (PK)
- `nome` (enum: "Criação do Processo", "Atualização de Dados", "Anexação de Documento", "Mudança de Status", "Comentário Adicionado") (NOT NULL) (não pode sofrer update)
- `usuario_id` (int) (NOT NULL) (REFERENCES usuario.id ON DELETE RESTRICT ON UPDATE CASCADE) (não pode sofrer update)
- `processo_id` (int) (NOT NULL) (REFERENCES processo.id ON DELETE CASCADE ON UPDATE CASCADE) (não pode sofrer update)
- `ativo` (boolean) (NOT NULL) (DEFAULT true)
- `criado_em` (timestamp) (NOT NULL) (DEFAULT NOW) (não pode sofrer update)
- `alterado_em` (timestamp) (NOT NULL) (DEFAULT NOW)


---


### usuario
- `id` (int) (NOT NULL) (PK)
- `nome` (varchar(128)) (NOT NULL)
- `hash_senha` (varchar(128)) (NOT NULL)
- `funcao` (enum: "Comum", "Admin") (DEFAULT "Comum")
- `email` (varchar(128)) (NOT NULL) (UNIQUE)
- `cpf` (varchar(11)) (NOT NULL) (UNIQUE)
- `sigla` (varchar(5)) (NOT NULL) (UNIQUE)
- `ativo` (boolean) (NOT NULL) (DEFAULT true)
- `criado_em` (timestamp) (NOT NULL) (DEFAULT NOW) (não pode sofrer update)
- `alterado_em` (timestamp) (NOT NULL) (DEFAULT NOW)


---


### documento
- `id` (int) (NOT NULL) (PK)
- `nome` (varchar(128)) (NOT NULL)
- `descricao` (text) (NULLABLE)
- `evento_id` (int) (NOT NULL) (REFERENCES evento.id ON DELETE CASCADE ON UPDATE CASCADE)
- `uri` (text) (NOT NULL)
- `extensao` (varchar(6)) (NOT NULL)
- `criado_em` (timestamp) (NOT NULL) (DEFAULT NOW) (não pode sofrer update)
- `alterado_em` (timestamp) (NOT NULL) (DEFAULT NOW)


## SQL


```sql
-- Enum types
CREATE TYPE status_proc AS ENUM ('Aberto', 'Em Andamento', 'Pendente', 'Concluído', 'Cancelado');
CREATE TYPE priority_proc AS ENUM ('Alta', 'Média', 'Baixa');
CREATE TYPE role_user AS ENUM ('Comum', 'Admin');
CREATE TYPE name_event AS ENUM (
 'Criação do Processo',
 'Atualização de Dados',
 'Anexação de Documento',
 'Mudança de Status',
 'Comentário Adicionado'
);


-- Tabela: usuario
CREATE TABLE users (
 id SERIAL PRIMARY KEY,
 name VARCHAR(128) NOT NULL,
 password VARCHAR(128) NOT NULL,
 role role_user DEFAULT 'Comum',
 email VARCHAR(128) NOT NULL UNIQUE,
 cpf VARCHAR(11) NOT NULL UNIQUE,
 sigle VARCHAR(5) NOT NULL UNIQUE,
 active BOOLEAN NOT NULL DEFAULT TRUE,
 created_at TIMESTAMP NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);


-- Tabela: processo
CREATE TABLE procs (
 id SERIAL PRIMARY KEY,
 number VARCHAR(20) NOT NULL UNIQUE,
 user_id INT NOT NULL,
 owner TEXT NOT NULL,
 description TEXT,
 status status_processo DEFAULT 'Aberto',
 priority priority_proc,
 term TIMESTAMP NOT NULL,
 active BOOLEAN NOT NULL DEFAULT TRUE,
 created_at TIMESTAMP NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMP NOT NULL DEFAULT NOW()
 CONSTRAINT fk_proc_user FOREIGN KEY (user_id)
   REFERENCES user(id)
   ON DELETE RESTRICT
   ON UPDATE CASCADE
);


-- Tabela: evento
CREATE TABLE events (
 id SERIAL PRIMARY KEY,
 name name_event NOT NULL,
 user_id INT NOT NULL,
 proc_id INT NOT NULL,
 active BOOLEAN NOT NULL DEFAULT TRUE,
 created_at TIMESTAMP NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMP NOT NULL DEFAULT NOW()
 CONSTRAINT fk_event_user FOREIGN KEY (user_id)
   REFERENCES user(id)
   ON DELETE RESTRICT
   ON UPDATE CASCADE,
 CONSTRAINT fk_event_proc FOREIGN KEY (proc_id)
   REFERENCES proc(id)
   ON DELETE CASCADE
   ON UPDATE CASCADE
);


-- Tabela: documento
CREATE TABLE docs (
 id SERIAL PRIMARY KEY,
 name VARCHAR(128) NOT NULL,
 description TEXT,
 event_id INT NOT NULL,
 uri TEXT NOT NULL,
 ext VARCHAR(6) NOT NULL,
 created_at TIMESTAMP NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMP NOT NULL DEFAULT NOW()
 CONSTRAINT fk_doc_event FOREIGN KEY (event_id)
   REFERENCES event(id)
   ON DELETE CASCADE
   ON UPDATE CASCADE
);




```


## Instalações necessárias
```bash
sudo apt update
sudo apt install composer
sudo apt install php-xml
sudo apt install php-curl
sudo apt install php-mysql
sudo apt install php-pgsql
```

## Criar o projeto
```bash
# 🚀 Criação e inicialização do projeto Laravel
composer create-project laravel/laravel .                                 

# ✅ Controllers: CRUD para cada entidade
php artisan make:controller ProcsController --api  
php artisan make:controller EventsController  --api
php artisan make:controller UsersController  --api
php artisan make:controller DocsController  --api
php artisan make:controller AcessController --api     
# Editar classes criadas em App\Http\Controllers
# Chamar controller em routes para processar requisições

# 🧠 Models: Entidades com propriedades
                    
php artisan make:model Proc
php artisan make:model Event
php artisan make:model Doc
# Editar classes criadas em App\Models
# Chamar Models em Controller para acesso ao banco de dados

# 🛡️ Form Requests: Validações personalizadas
php artisan make:request ProcRequest         
php artisan make:request UserRequest
php artisan make:request EventRequest
php artisan make:request DocRequest
# Editar classes criadas em App\Http\Requests
# Chamar requests em Controller para validação

# 🏗️ Migrations: Estrutura do banco de dados
php artisan make:migration create_procs_table
php artisan make:migration create_events_table  
php artisan make:migration create_docs_table
# Editar tabelas criadas em database\migrations

php artisan migrate      

composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
# Adicionar expires em config/sanctum.php
# Habilitar middleware de autenticação app/Http/Kernel
# Adicionar trait HasApiTokens no model User

php artisan migrate

php artisan make:seeder UserSeeder
# Editar o seeder

php artisan db:seed

# 📁 Documentos públicos (uploads)
php artisan storage:link                         

php artisan make:policy UserPolicy --model=User
php artisan make:policy ProcPolicy --model=Proc
# Editar classes criadas em App\Http\Policies
# Chamar as models policiadas
# Registrar no AuthServiceProvider
# Proteger suas rotas ou ações de controller: $this->authorize(...);


# 🌐 Inicia o servidor de desenvolvimento
php artisan serve
```

## Eventos admitidos

- Criação (com documento) (instauração de ofício ou a pedido)
- Juntada de documento -> despacho/termo de recebimento (mercadoria entregue) -> vai ter o encaminhamento
- Baixa/Arquivamento

## Expansões futuras

- criação processo (precisa inserir um doc);
- Sigilo do documento: ostensivo, restrito ou sigiloso (LGPD);
- Nome fixo de documentos (NF, Ofício, Despacho, Etc.);
- Assinaturas de documentos;
- Sistema de encaminhamento (entre unidades);
- Embutir um editor de texto como CKEditor