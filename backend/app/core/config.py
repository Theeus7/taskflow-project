from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # API settings
    API_V1_STR: str = "/api/v1"
    
    # CORS settings
    CORS_ORIGINS: List[str] = ["http://localhost", "http://localhost:4200", "http://127.0.0.1", "http://127.0.0.1:4200"]
    
    # JWT settings
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"

settings = Settings()