"""
Application Configuration
Environment variables and settings management
"""
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""

    # Application
    APP_NAME: str = "My Life Stats"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/your_life_stats"

    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"

    # OpenAI
    OPENAI_API_KEY: str = ""

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3050",
        "http://127.0.0.1:3050",
        "https://yourlife.alldatabox.com",
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
