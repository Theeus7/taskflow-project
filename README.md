# TaskFlow - Sistema de Gerenciamento de Tarefas

Este repositório contém o código-fonte completo do TaskFlow, um sistema de gerenciamento de tarefas com frontend em Angular e backend em FastAPI. O sistema permite aos usuários gerenciar tarefas com diferentes status e prioridades, além de fornecer estatísticas através de um dashboard.

## Estrutura do Projeto

```
taskflow-project/
├── backend/                      # API REST em FastAPI
│   ├── app/                      # Código principal da aplicação
│   │   ├── api/                  # Endpoints da API
│   │   │   └── v1/               # Versão 1 da API
│   │   │       └── endpoints/    # Controladores da API
│   │   │           ├── task.py   # Endpoints de tarefas
│   │   │           └── user.py   # Endpoints de usuários
│   │   ├── core/                 # Configurações centrais
│   │   │   └── config.py         # Configurações da aplicação
│   │   ├── crud/                 # Operações de banco de dados
│   │   │   ├── task.py           # Operações CRUD para tarefas
│   │   │   └── user.py           # Operações CRUD para usuários
│   │   ├── db/                   # Configuração do banco de dados
│   │   │   ├── models/           # Modelos SQLAlchemy
│   │   │   │   ├── task.py       # Modelo de tarefa
│   │   │   │   └── user.py       # Modelo de usuário
│   │   │   ├── base.py           # Base declarativa
│   │   │   ├── init_db.py        # Inicialização do banco
│   │   │   └── session.py        # Configuração da sessão
│   │   ├── models/               # Modelos de domínio
│   │   │   └── user.py           # Modelo de usuário
│   │   ├── schemas/              # Esquemas Pydantic
│   │   │   ├── task.py           # Esquemas de tarefa
│   │   │   └── user.py           # Esquemas de usuário
│   │   └── main.py               # Ponto de entrada da aplicação
│   ├── .env                      # Variáveis de ambiente
│   └── init_db.py                # Script de inicialização do banco
└── frontend/                     # Aplicação Angular
    ├── src/                      # Código-fonte
    │   ├── app/                  # Componentes da aplicação
    │   │   ├── dashboard/        # Dashboard com estatísticas
    │   │   ├── guards/           # Guards de autenticação
    │   │   ├── login/            # Componente de login
    │   │   ├── register/         # Componente de registro
    │   │   ├── services/         # Serviços da aplicação
    │   │   ├── shared/           # Componentes compartilhados
    │   │   ├── tasks/            # Componentes de tarefas
    │   │   │   └── task-form/    # Formulário de tarefas
    │   │   ├── app.component.ts  # Componente raiz
    │   │   └── app.routes.ts     # Configuração de rotas
    │   ├── assets/               # Recursos estáticos
    │   └── styles.css            # Estilos globais
    └── angular.json              # Configuração do Angular
```

## Recursos Implementados

### 1. Autenticação de Usuários

Sistema completo de autenticação com registro, login e proteção de rotas.

**Recursos principais:**
- Registro de novos usuários com validação de dados
- Login seguro com email e senha
- Proteção de rotas com AuthGuard
- Armazenamento seguro de senhas com hash
- Autenticação baseada em JWT (JSON Web Tokens)

### 2. Dashboard

Painel de controle com visão geral das tarefas do usuário.

**Recursos principais:**
- Estatísticas de tarefas por status (pendentes, em andamento, concluídas)
- Visualização rápida do progresso das tarefas
- Interface intuitiva e responsiva

### 3. Gerenciamento de Tarefas

Sistema completo de CRUD para tarefas com recursos avançados.

**Recursos principais:**
- Listagem de tarefas com múltiplos filtros
- Busca por texto em títulos e descrições
- Ordenação por diferentes campos (título, data, status, prioridade)
- Paginação para melhor desempenho
- Criação e edição de tarefas com formulários validados
- Exclusão de tarefas com confirmação
- Atualização rápida de status e prioridade via dropdown

### 4. Banco de Dados MySQL

Armazenamento persistente de dados em MySQL.

**Recursos principais:**
- Modelagem relacional com SQLAlchemy
- Relacionamentos entre usuários e tarefas
- Suporte a consultas complexas
- Gerenciamento via MySQL Workbench

## Tecnologias Utilizadas

### Frontend
- **Angular 19**: Framework moderno para desenvolvimento de aplicações web SPA (Single Page Application), escolhido pela sua robustez, componentização e ferramentas de desenvolvimento.
- **TypeScript**: Linguagem fortemente tipada que melhora a manutenção e escalabilidade do código.
- **Reactive Forms**: Módulo do Angular para gerenciamento de formulários reativos, facilitando validações e manipulação de dados.
- **Angular Router**: Sistema de navegação e roteamento para criar uma experiência de navegação fluida.

### Backend
- **FastAPI**: Framework Python de alta performance para APIs, escolhido pela sua velocidade, facilidade de uso e documentação automática com Swagger.
- **SQLAlchemy**: ORM (Object-Relational Mapping) que simplifica a interação com o banco de dados, permitindo trabalhar com objetos Python em vez de SQL direto.
- **Pydantic**: Biblioteca para validação de dados e configurações usando anotações de tipo Python.
- **MySQL**: Sistema de gerenciamento de banco de dados relacional, escolhido pela sua confiabilidade, desempenho e ampla adoção no mercado.
- **JWT (JSON Web Tokens)**: Mecanismo para autenticação segura entre cliente e servidor.

## Como Utilizar

### Pré-requisitos
- Node.js (v18+)
- npm (v9+)
- Python (v3.8+)
- MySQL (v8.0+)
- MySQL Workbench (para gerenciamento do banco de dados)

### Configuração do Backend

1. **Crie e ative um ambiente virtual Python**:
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate  # No Windows: venv\Scripts\activate
   ```

2. **Instale as dependências**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure o banco de dados MySQL**:
   - Instale o MySQL Server e MySQL Workbench
   - Configure as credenciais no arquivo `.env` na pasta backend:
     ```
     MYSQL_USER=seu_usuario
     MYSQL_PASSWORD=sua_senha
     MYSQL_HOST=localhost
     MYSQL_PORT=3306
     MYSQL_DB=taskflow
     SECRET_KEY=sua_chave_secreta
     ```

### Configuração do Frontend

1. **Instale as dependências**:
   ```bash
   cd frontend
   npm install
   ```

### Inicialização

#### Backend
```bash
cd backend
source venv/bin/activate  # No Windows: venv\Scripts\activate
uvicorn app.main:app --reload
```
O servidor estará disponível em `http://localhost:8000`
A documentação da API estará disponível em `http://localhost:8000/docs`

#### Frontend
```bash
cd frontend
ng serve
```
A aplicação estará disponível em `http://localhost:4200`

## Modelos de Dados

### Usuário
- `id`: Identificador único
- `username`: Nome de usuário
- `email`: Email do usuário (único)
- `hashed_password`: Senha criptografada

### Tarefa
- `id`: Identificador único
- `title`: Título da tarefa
- `description`: Descrição detalhada (opcional)
- `status`: Estado atual (pendente, em_andamento, concluida)
- `priority`: Prioridade (baixa, media, alta)
- `due_date`: Data de vencimento (opcional)
- `created_at`: Data de criação
- `updated_at`: Data da última atualização
- `user_id`: Referência ao usuário proprietário

## Segurança e Controle de Acesso

- Autenticação baseada em JWT com tempo de expiração configurável
- Senhas armazenadas com hash seguro
- Proteção de rotas no frontend com AuthGuard
- Validação de dados no backend com Pydantic
- Acesso a tarefas restrito aos usuários proprietários

## Notas Importantes

- O sistema utiliza JWT (JSON Web Tokens) para autenticação
- As senhas são armazenadas de forma segura utilizando hash
- O frontend se comunica com o backend através de requisições HTTP
- O sistema suporta filtros e ordenação tanto no cliente quanto no servidor
- A interface é responsiva e adaptável a diferentes tamanhos de tela

---

Desenvolvido como projeto acadêmico para o Centro Universitário Braz Cubas.