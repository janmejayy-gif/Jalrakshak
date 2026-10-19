from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        protected_namespaces=("settings_",),
    )
    ml_service_host: str = "0.0.0.0"
    ml_service_port: int = 8000
    model_path: str = "./models/irrigation_model.pkl"
    model_version: str = "1.0.0"
    backend_url: str = "http://localhost:8080"
    log_level: str = "INFO"


settings = Settings()