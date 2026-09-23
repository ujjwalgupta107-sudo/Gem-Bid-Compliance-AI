import os
from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    # Swap DATABASE_URL to a Postgres DSN (e.g. postgresql+psycopg2://user:pass@host/db)
    # to move this prototype onto Postgres without touching model code.
    database_url: str = f"sqlite:///{BASE_DIR / 'gem_compliance.db'}"
    secret_key: str = "sih26100-dev-secret-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 480
    upload_dir: Path = BASE_DIR / "uploads"
    reports_dir: Path = BASE_DIR / "reports"
    max_upload_mb: int = 15
    allowed_mime_types: tuple = ("application/pdf", "image/png", "image/jpeg")
    ai_provider: str = os.getenv("AI_PROVIDER", "local")  # local | openai | anthropic (pluggable)

    @property
    def sqlalchemy_database_url(self) -> str:
        url = self.database_url
        if not url:
            return f"sqlite:///{BASE_DIR / 'gem_compliance.db'}"
        if url.startswith("postgres://"):
            return url.replace("postgres://", "postgresql://", 1)
        return url

    class Config:
        env_file = ".env"


settings = Settings()
settings.upload_dir.mkdir(parents=True, exist_ok=True)
settings.reports_dir.mkdir(parents=True, exist_ok=True)
