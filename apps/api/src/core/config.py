from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


API_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    appName: str = "VibeBoard AI Agile API"
    apiPrefix: str = "/api"
    appVersion: str = "0.1.0"
    databaseUrl: str = f"sqlite:///{(API_DIR / '.data' / 'vibeboard.db').as_posix()}"
    corsOrigins: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="VIBEBOARD_",
        extra="ignore",
    )

    @field_validator("corsOrigins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()
