# TaskFlow Backend

## Configuração do Banco de Dados MySQL

1. Instale o MySQL Server e MySQL Workbench
2. Configure as credenciais no arquivo `.env` na raiz do projeto backend:
   ```
   MYSQL_USER=seu_usuario
   MYSQL_PASSWORD=sua_senha
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_DB=taskflow
   ```
3. Crie um banco de dados chamado `taskflow` no MySQL Workbench ou execute o script de inicialização

## Inicialização do Banco de Dados

Execute o script de inicialização para criar o banco de dados e as tabelas:

```bash
# Ative o ambiente virtual
source venv/bin/activate

# Execute o script de inicialização
python init_db.py
```

## Executando a Aplicação

```bash
# Ative o ambiente virtual
source venv/bin/activate

# Execute a aplicação
uvicorn app.main:app --reload
```