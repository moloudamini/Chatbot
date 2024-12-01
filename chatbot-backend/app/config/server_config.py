from pydantic import BaseSettings, AnyHttpUrl
from dotenv import load_dotenv

load_dotenv()

class ServerConfig(BaseSettings):
    debug: bool = False
    allowed_origins: AnyHttpUrl = "http://localhost" 
    log_level: str = "INFO"

    class Config:
        env_file = ".env"

server_config = ServerConfig()
