"""Language management endpoints."""

from fastapi import APIRouter
from ..core.config import get_settings

router = APIRouter(prefix="/api/languages", tags=["languages"])
settings = get_settings()


@router.get("/")
async def list_languages():
    """List all supported languages with their voices."""
    return {
        "languages": [
            {
                "code": code,
                "name": info["name"],
                "flag": info["flag"],
                "voice": info["voice"],
            }
            for code, info in settings.language_voices.items()
        ]
    }


@router.get("/{code}")
async def get_language(code: str):
    """Get details for a specific language."""
    info = settings.language_voices.get(code)
    if not info:
        return {"error": f"Language '{code}' not supported"}
    return {
        "code": code,
        "name": info["name"],
        "flag": info["flag"],
        "voice": info["voice"],
    }
