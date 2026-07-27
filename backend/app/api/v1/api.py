from fastapi import APIRouter
from app.api.v1.endpoints import ytmusic

api_router = APIRouter()
api_router.include_router(ytmusic.router, tags=["YTMusic"])
