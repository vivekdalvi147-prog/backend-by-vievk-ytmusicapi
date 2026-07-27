from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from loguru import logger

def add_exception_handlers(app: FastAPI):
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error(f"Global exception: {exc}")
        return JSONResponse(
            status_code=500,
            content={"message": "Internal server error"},
        )
