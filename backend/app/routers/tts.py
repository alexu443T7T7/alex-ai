"""Text-to-Speech API endpoints."""

from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

from ..models.schemas import TTSRequest
from ..services.tts_service import synthesize_speech, get_available_voices

router = APIRouter(prefix="/api/tts", tags=["tts"])


@router.post("/synthesize")
async def synthesize(request: TTSRequest):
    """Convert text to speech and return audio."""
    try:
        audio_bytes = await synthesize_speech(
            text=request.text,
            language=request.language,
            voice_override=request.voice,
        )
        return Response(
            content=audio_bytes,
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "inline; filename=speech.mp3",
            },
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS error: {str(e)}")


@router.get("/voices")
async def list_voices(language: str | None = None):
    """List available TTS voices."""
    try:
        voices = await get_available_voices(language)
        return {"voices": voices}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing voices: {str(e)}")
