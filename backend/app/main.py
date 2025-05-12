from fastapi import FastAPI
from app.api.v1.endpoints import user
from app.db.base import Base
from app.db.session import engine

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(user.router, prefix="/api/v1/users", tags=["users"])
