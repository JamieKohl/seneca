from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    anthropic_api_key: str = ""
    finnhub_api_key: str = ""
    debug: bool = False

    class Config:
        env_file = ".env"


settings = Settings()
