import logging
from app.config.server_config import server_config

def setup_logging() -> None:
    logger = logging.getLogger()
    if not logger.hasHandlers():
        logger.setLevel(server_config.log_level.upper())

        formatter = logging.Formatter(
            "[%(asctime)s] %(levelname)s in %(module)s: %(message)s"
        )
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)
    else:
        logger.setLevel(server_config.log_level.upper())
