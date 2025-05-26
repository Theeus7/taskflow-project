from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import user, task
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
import pymysql

# Inicializa o banco de dados na inicialização
try:
    # Conecta ao servidor MySQL sem especificar um banco de dados
    conn = pymysql.connect(
        host=settings.MYSQL_HOST,
        user=settings.MYSQL_USER,
        password=settings.MYSQL_PASSWORD,
        port=int(settings.MYSQL_PORT)
    )
    
    cursor = conn.cursor()
    
    # Cria o banco de dados se não existir
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {settings.MYSQL_DB}")
    
    conn.close()
    
    # Cria as tabelas
    Base.metadata.create_all(bind=engine)
    
except Exception as e:
    print(f"Erro ao inicializar o banco de dados: {e}")

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router, prefix="/api/v1/users", tags=["users"])
app.include_router(task.router, prefix="/api/v1/tasks", tags=["tasks"])
