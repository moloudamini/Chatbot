from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.routers import chat, health
from app.config.logging_config import setup_logging
from app.config.server_config import server_config
from app.exceptions.handlers import http_exception_handler, generic_exception_handler

def create_app() -> FastAPI:
    
    # Setup logging
    setup_logging()

    # Initialize FastAPI
    app = FastAPI()

    # CORS Middleware 
    app.add_middleware(
        CORSMiddleware,
        allow_origins=server_config.allowed_origins, 
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include Routers 
    app.include_router(chat.router)
    app.include_router(health.router)

    # Exception Handlers
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(Exception, generic_exception_handler)

    return app

app = create_app()
