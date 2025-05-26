# Estrutura do Frontend

O frontend do TaskFlow foi reorganizado para separar os arquivos por tipo, seguindo boas práticas de organização de código.

## Estrutura de Diretórios

```
src/app/
├── components/           # Componentes da aplicação
│   ├── auth/             # Componentes de autenticação
│   │   ├── login/        # Componente de login
│   │   └── register/     # Componente de registro
│   ├── dashboard/        # Componente de dashboard
│   ├── shared/           # Componentes compartilhados
│   │   └── navbar/       # Componente de navegação
│   └── tasks/            # Componentes de tarefas
│       └── task-form/    # Componente de formulário de tarefas
├── guards/               # Guards de autenticação
├── models/               # Modelos de dados
├── services/             # Serviços da aplicação
├── styles/               # Arquivos CSS
└── templates/            # Arquivos HTML
```

## Organização por Tipo

- **components/**: Contém todos os componentes TypeScript da aplicação
- **models/**: Contém as interfaces e tipos de dados
- **services/**: Contém os serviços que fazem chamadas à API
- **guards/**: Contém os guards de autenticação
- **styles/**: Contém todos os arquivos CSS
- **templates/**: Contém todos os arquivos HTML

Esta organização facilita a manutenção do código, pois agrupa arquivos por sua função e tipo, em vez de por componente.