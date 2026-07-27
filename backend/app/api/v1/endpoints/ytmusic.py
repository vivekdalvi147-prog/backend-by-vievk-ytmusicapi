from fastapi import APIRouter, HTTPException, Query, Request
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

