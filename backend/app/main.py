from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from app.core.config import settings
from app.core.logging import setup_logging
from app.api.v1.api import api_router
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.middlewares.rate_limit import limiter
from app.middlewares.error_middleware import add_exception_handlers
from app.middlewares.logging_middleware import LoggingMiddleware

setup_logging()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Rate limiter setup
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Custom exception handlers
add_exception_handlers(app)

# Middlewares
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Note: Add LoggingMiddleware via app.middleware("http") decorators or custom class if needed
app.add_middleware(LoggingMiddleware)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["System"])
async def health_check():
    return {"status": "healthy", "version": settings.VERSION}
