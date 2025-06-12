from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql+asyncpg://postgres:password@localhost:5432/nike_store"
    redis_url: str = "redis://localhost:6379"
    
    # Security
    secret_key: str = "your-super-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Application
    debug: bool = True
    cors_origins: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    # External Services
    stripe_secret_key: str = "sk_test_your_stripe_secret_key"
    stripe_publishable_key: str = "pk_test_your_stripe_publishable_key"
    
    # File Upload
    upload_dir: str = "uploads"
    max_file_size: int = 5242880  # 5MB
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Create settings instance
settings = Settings()

# Ensure upload directory exists
os.makedirs(settings.upload_dir, exist_ok=True)