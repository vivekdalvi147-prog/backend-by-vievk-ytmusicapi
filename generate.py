import os

files = {
    "backend/requirements.txt": """fastapi==0.111.0
uvicorn[standard]==0.30.1
pydantic==2.7.4
pydantic-settings==2.3.4
ytmusicapi==1.7.0
httpx==0.27.0
PyJWT==2.8.0
python-multipart==0.0.9
loguru==0.7.2
slowapi==0.1.9
""",
    "backend/.env.example": """# VMusic Backend Environment Configuration
PROJECT_NAME="VMusic API"
VERSION="1.0.0"
API_V1_STR="/api/v1"
ENVIRONMENT="development"
CORS_ORIGINS=["*"]

# Security
SECRET_KEY="your-super-secret-key-change-in-production"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Rate Limiting
RATE_LIMIT_GLOBAL="100/minute"
""",
    "backend/Dockerfile": """FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \\
    PYTHONDONTWRITEBYTECODE=1 \\
    PIP_NO_CACHE_DIR=off \\
    PIP_DISABLE_PIP_VERSION_CHECK=on \\
    PIP_DEFAULT_TIMEOUT=100

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
""",
    "backend/docker-compose.yml": """version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    env_file:
      - .env
    volumes:
      - .:/app
    restart: unless-stopped
""",
    "backend/README.md": """# VMusic API

Production-ready backend for the VMusic Android application by Vivek Dalvi, powered by FastAPI and ytmusicapi.

## Tech Stack
- Python 3.12+
- FastAPI & Uvicorn
- Pydantic V2
- ytmusicapi
- SlowAPI (Rate Limiting)
- JWT Authentication

## Setup

1. Clone and cd into `backend`
2. `cp .env.example .env`
3. Install dependencies: `pip install -r requirements.txt`
4. Run locally: `uvicorn app.main:app --reload`
5. Docs available at `http://127.0.0.1:8000/docs`

## Docker Setup

```bash
docker-compose up -d --build
```

## Deployment (Ubuntu VPS & Nginx)

1. Clone repo on VPS.
2. Run via Docker Compose.
3. Configure Nginx reverse proxy to `127.0.0.1:8000`.
4. Secure with Certbot (Let's Encrypt).
""",
    "backend/app/__init__.py": "",
    "backend/app/main.py": """from fastapi import FastAPI, Depends
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
""",
    "backend/app/core/__init__.py": "",
    "backend/app/core/config.py": """from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import json

class Settings(BaseSettings):
    PROJECT_NAME: str = "VMusic API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    CORS_ORIGINS: List[str] = ["*"]
    
    SECRET_KEY: str = "super-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    RATE_LIMIT_GLOBAL: str = "100/minute"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
""",
    "backend/app/core/security.py": """from datetime import datetime, timedelta, timezone
import jwt
from app.core.config import settings

def create_access_token(subject: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt
""",
    "backend/app/core/logging.py": """import sys
from loguru import logger
from app.core.config import settings

def setup_logging():
    logger.remove()
    level = "DEBUG" if settings.ENVIRONMENT == "development" else "INFO"
    logger.add(sys.stdout, colorize=True, format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>", level=level)
""",
    "backend/app/middlewares/__init__.py": "",
    "backend/app/middlewares/rate_limit.py": """from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
""",
    "backend/app/middlewares/error_middleware.py": """from fastapi import FastAPI, Request
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
""",
    "backend/app/middlewares/logging_middleware.py": """from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from loguru import logger
import time

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        logger.info(f"{request.method} {request.url.path} - {response.status_code} - {process_time:.4f}s")
        return response
""",
    "backend/app/schemas/__init__.py": "",
    "backend/app/schemas/ytmusic_schemas.py": """from pydantic import BaseModel
from typing import Any, Dict, List, Optional

class SearchQuery(BaseModel):
    query: str
    filter: Optional[str] = None
    limit: int = 20

class StandardResponse(BaseModel):
    success: bool = True
    data: Any
    message: Optional[str] = None
""",
    "backend/app/services/__init__.py": "",
    "backend/app/services/ytmusic_service.py": """from ytmusicapi import YTMusic
import asyncio
from typing import Any, Dict, List

class YTMusicService:
    def __init__(self):
        # ytmusicapi initializes synchronously
        self.yt = YTMusic()

    async def search(self, query: str, filter: str = None, limit: int = 20) -> List[Dict]:
        return await asyncio.to_thread(self.yt.search, query, filter, limit)

    async def get_song(self, video_id: str) -> Dict:
        return await asyncio.to_thread(self.yt.get_song, video_id)

    async def get_lyrics(self, browse_id: str) -> Dict:
        return await asyncio.to_thread(self.yt.get_lyrics, browse_id)

    async def get_artist(self, channel_id: str) -> Dict:
        return await asyncio.to_thread(self.yt.get_artist, channel_id)

    async def get_artist_albums(self, channel_id: str, params: str) -> Dict:
        return await asyncio.to_thread(self.yt.get_artist_albums, channel_id, params)

    async def get_album(self, browse_id: str) -> Dict:
        return await asyncio.to_thread(self.yt.get_album, browse_id)

    async def get_playlist(self, playlist_id: str, limit: int = 100) -> Dict:
        return await asyncio.to_thread(self.yt.get_playlist, playlist_id, limit)

    async def get_related(self, browse_id: str) -> Any:
        return await asyncio.to_thread(self.yt.get_song_related, browse_id)
        
    async def get_home(self) -> List[Dict]:
        return await asyncio.to_thread(self.yt.get_home)
        
    async def get_charts(self, country: str = "US") -> Dict:
        return await asyncio.to_thread(self.yt.get_charts, country)
        
    async def get_moods(self) -> Dict:
        return await asyncio.to_thread(self.yt.get_mood_categories)
        
    async def get_mood_playlists(self, params: str) -> List[Dict]:
        return await asyncio.to_thread(self.yt.get_mood_playlists, params)
        
    async def get_watch_playlist(self, video_id: str, limit: int = 25) -> Dict:
        return await asyncio.to_thread(self.yt.get_watch_playlist, video_id, limit=limit)
        
    async def get_search_suggestions(self, query: str) -> List[Any]:
        return await asyncio.to_thread(self.yt.get_search_suggestions, query)
        
    async def get_user(self, channel_id: str) -> Dict:
        return await asyncio.to_thread(self.yt.get_user, channel_id)

yt_service = YTMusicService()
""",
    "backend/app/api/v1/__init__.py": "",
    "backend/app/api/v1/api.py": """from fastapi import APIRouter
from app.api.v1.endpoints import ytmusic

api_router = APIRouter()
api_router.include_router(ytmusic.router, tags=["YTMusic"])
""",
    "backend/app/api/v1/endpoints/__init__.py": "",
    "backend/app/api/v1/endpoints/ytmusic.py": """from fastapi import APIRouter, HTTPException, Query, Request
from app.services.ytmusic_service import yt_service
from app.schemas.ytmusic_schemas import StandardResponse
from app.middlewares.rate_limit import limiter
from typing import Optional

router = APIRouter()

@router.get("/search", response_model=StandardResponse, summary="Search YT Music")
@limiter.limit("30/minute")
async def search(
    request: Request,
    q: str = Query(..., description="Search query"),
    filter: Optional[str] = Query(None, description="Filter (e.g. songs, videos, albums)"),
    limit: int = Query(20, le=100)
):
    try:
        data = await yt_service.search(q, filter, limit)
        return StandardResponse(data=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/song/{videoId}", response_model=StandardResponse, summary="Get song details")
@limiter.limit("60/minute")
async def get_song(request: Request, videoId: str):
    try:
        data = await yt_service.get_song(videoId)
        return StandardResponse(data=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/lyrics/{browseId}", response_model=StandardResponse, summary="Get song lyrics")
@limiter.limit("60/minute")
async def get_lyrics(request: Request, browseId: str):
    try:
        data = await yt_service.get_lyrics(browseId)
        return StandardResponse(data=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/artist/{artistId}", response_model=StandardResponse, summary="Get artist details")
@limiter.limit("60/minute")
async def get_artist(request: Request, artistId: str):
    try:
        data = await yt_service.get_artist(artistId)
        return StandardResponse(data=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/artist/{artistId}/albums", response_model=StandardResponse, summary="Get artist albums")
@limiter.limit("60/minute")
async def get_artist_albums(request: Request, artistId: str, params: str = Query(...)):
    try:
        data = await yt_service.get_artist_albums(artistId, params)
        return StandardResponse(data=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/album/{albumId}", response_model=StandardResponse, summary="Get album details")
@limiter.limit("60/minute")
async def get_album(request: Request, albumId: str):
    try:
        data = await yt_service.get_album(albumId)
        return StandardResponse(data=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/playlist/{playlistId}", response_model=StandardResponse, summary="Get playlist details & tracks")
@limiter.limit("30/minute")
async def get_playlist(request: Request, playlistId: str, limit: int = Query(100, le=500)):
    try:
        data = await yt_service.get_playlist(playlistId, limit)
        return StandardResponse(data=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/related/{browseId}", response_model=StandardResponse, summary="Get related content")
@limiter.limit("60/minute")
async def get_related(request: Request, browseId: str):
    try:
        data = await yt_service.get_related(browseId)
        return StandardResponse(data=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/home", response_model=StandardResponse, summary="Get YT Music Home")
@limiter.limit("20/minute")
async def get_home(request: Request):
    try:
        data = await yt_service.get_home()
        return StandardResponse(data=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/charts", response_model=StandardResponse, summary="Get YT Music Charts")
@limiter.limit("20/minute")
async def get_charts(request: Request, country: str = Query("ZZ")):
    try:
        data = await yt_service.get_charts(country)
        return StandardResponse(data=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/moods", response_model=StandardResponse, summary="Get Mood Categories")
@limiter.limit("30/minute")
async def get_moods(request: Request):
    try:
        data = await yt_service.get_moods()
        return StandardResponse(data=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/mood/{params}", response_model=StandardResponse, summary="Get Mood Playlists")
@limiter.limit("30/minute")
async def get_mood_playlists(request: Request, params: str):
    try:
        data = await yt_service.get_mood_playlists(params)
        return StandardResponse(data=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/watch/{videoId}", response_model=StandardResponse, summary="Get Watch Playlist (Next Songs)")
@limiter.limit("60/minute")
async def get_watch_playlist(request: Request, videoId: str, limit: int = Query(25, le=100)):
    try:
        data = await yt_service.get_watch_playlist(videoId, limit)
        return StandardResponse(data=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search/suggestions", response_model=StandardResponse, summary="Get Search Suggestions")
@limiter.limit("100/minute")
async def get_search_suggestions(request: Request, q: str = Query(...)):
    try:
        data = await yt_service.get_search_suggestions(q)
        return StandardResponse(data=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/{channelId}", response_model=StandardResponse, summary="Get User Details")
@limiter.limit("60/minute")
async def get_user(request: Request, channelId: str):
    try:
        data = await yt_service.get_user(channelId)
        return StandardResponse(data=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status", response_model=StandardResponse, summary="Get Backend Status")
async def get_status(request: Request):
    return StandardResponse(data={"status": "online", "service": "VMusic API"})

"""
}

for filepath, content in files.items():
    os.makedirs(os.path.dirname(filepath) or '.', exist_ok=True)
    with open(filepath, 'w') as f:
        f.write(content)

print("Files generated successfully!")
