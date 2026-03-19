"""Text-to-Speech service using Edge TTS for high-quality multilingual voices."""

import edge_tts
import io
import hashlib
import os
import tempfile
from pathlib import Path

from ..core.config import get_settings

settings = get_settings()

# Simple file-based cache for TTS audio
CACHE_DIR = Path(tempfile.gettempdir()) / "voxmentor_tts_cache"
CACHE_DIR.mkdir(exist_ok=True)


def _get_voice_for_language(language: str, voice_override: str | None = None) -> str:
    """Get the appropriate TTS voice for a language."""
    if voice_override:
        return voice_override
    lang_config = settings.language_voices.get(language)
    if lang_config:
        return lang_config["voice"]
    return settings.tts_default_voice


def _get_cache_key(text: str, voice: str) -> str:
    """Generate a cache key for the given text and voice."""
    content = f"{voice}:{text}"
    return hashlib.md5(content.encode()).hexdigest()


async def synthesize_speech(
    text: str,
    language: str = "fr",
    voice_override: str | None = None,
) -> bytes:
    """Convert text to speech using Edge TTS.

    Returns MP3 audio bytes.
    """
    voice = _get_voice_for_language(language, voice_override)

    # Check cache
    cache_key = _get_cache_key(text, voice)
    cache_path = CACHE_DIR / f"{cache_key}.mp3"

    if cache_path.exists():
        return cache_path.read_bytes()

    # Generate speech
    communicate = edge_tts.Communicate(text, voice)

    audio_buffer = io.BytesIO()
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_buffer.write(chunk["data"])

    audio_bytes = audio_buffer.getvalue()

    # Cache the result (only if reasonably sized, < 5MB)
    if len(audio_bytes) < 5 * 1024 * 1024:
        cache_path.write_bytes(audio_bytes)

    return audio_bytes


async def get_available_voices(language: str | None = None) -> list[dict]:
    """Get list of available Edge TTS voices, optionally filtered by language."""
    voices = await edge_tts.list_voices()

    if language:
        # Edge TTS uses locale codes like "fr-FR", "en-US"
        voices = [v for v in voices if v["Locale"].startswith(language)]

    return [
        {
            "id": v["ShortName"],
            "name": v["FriendlyName"],
            "locale": v["Locale"],
            "gender": v["Gender"],
        }
        for v in voices
    ]
