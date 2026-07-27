# VMusic API

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
