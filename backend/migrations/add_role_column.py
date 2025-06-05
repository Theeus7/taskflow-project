from sqlalchemy import create_engine, text
from app.core.config import settings

# Configuração da conexão com o banco de dados
DATABASE_URL = f"mysql+pymysql://{settings.MYSQL_USER}:{settings.MYSQL_PASSWORD}@{settings.MYSQL_HOST}:{settings.MYSQL_PORT}/{settings.MYSQL_DB}"

def run_migration():
    # Conectar ao banco de dados
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as connection:
        # Verificar se a coluna já existe
        result = connection.execute(text(
            "SELECT COUNT(*) FROM information_schema.COLUMNS "
            "WHERE TABLE_SCHEMA = :db AND TABLE_NAME = 'users' AND COLUMN_NAME = 'role'"
        ), {"db": settings.MYSQL_DB})
        
        column_exists = result.scalar() > 0
        
        if not column_exists:
            # Adicionar a coluna role
            connection.execute(text(
                "ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user'"
            ))
            
            # Atualizar o primeiro usuário para ser admin
            connection.execute(text(
                "UPDATE users SET role = 'admin' WHERE id = 1"
            ))
            
            connection.commit()
            print("Migração concluída: coluna 'role' adicionada à tabela 'users'")
            print("O usuário com ID 1 foi promovido a administrador")
        else:
            print("A coluna 'role' já existe na tabela 'users'")

if __name__ == "__main__":
    run_migration()