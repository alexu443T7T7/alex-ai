"""Application configuration."""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    app_name: str = "VoxMentor AI"
    app_description: str = "AI-powered voice education platform"
    debug: bool = False

    # Ollama
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "mistral"

    # TTS - Edge TTS (free, high-quality, multilingual)
    tts_default_voice: str = "fr-FR-DeniseNeural"

    # Session
    session_max_history: int = 50
    secret_key: str = "change-me-in-production-use-strong-secret"

    # CORS
    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:5173", "http://localhost:8000"]

    # Supported languages with their TTS voices (Edge TTS)
    language_voices: dict[str, dict[str, str]] = {
        "fr": {"name": "Français", "voice": "fr-FR-DeniseNeural", "flag": "🇫🇷"},
        "en": {"name": "English", "voice": "en-US-JennyNeural", "flag": "🇺🇸"},
        "es": {"name": "Español", "voice": "es-ES-ElviraNeural", "flag": "🇪🇸"},
        "de": {"name": "Deutsch", "voice": "de-DE-KatjaNeural", "flag": "🇩🇪"},
        "it": {"name": "Italiano", "voice": "it-IT-ElsaNeural", "flag": "🇮🇹"},
        "pt": {"name": "Português", "voice": "pt-BR-FranciscaNeural", "flag": "🇧🇷"},
        "ru": {"name": "Русский", "voice": "ru-RU-SvetlanaNeural", "flag": "🇷🇺"},
        "zh": {"name": "中文", "voice": "zh-CN-XiaoxiaoNeural", "flag": "🇨🇳"},
        "ja": {"name": "日本語", "voice": "ja-JP-NanamiNeural", "flag": "🇯🇵"},
        "ko": {"name": "한국어", "voice": "ko-KR-SunHiNeural", "flag": "🇰🇷"},
        "ar": {"name": "العربية", "voice": "ar-SA-ZariyahNeural", "flag": "🇸🇦"},
        "hi": {"name": "हिन्दी", "voice": "hi-IN-SwaraNeural", "flag": "🇮🇳"},
        "tr": {"name": "Türkçe", "voice": "tr-TR-EmelNeural", "flag": "🇹🇷"},
        "pl": {"name": "Polski", "voice": "pl-PL-AgnieszkaNeural", "flag": "🇵🇱"},
        "nl": {"name": "Nederlands", "voice": "nl-NL-ColetteNeural", "flag": "🇳🇱"},
        "sv": {"name": "Svenska", "voice": "sv-SE-SofieNeural", "flag": "🇸🇪"},
        "da": {"name": "Dansk", "voice": "da-DK-ChristelNeural", "flag": "🇩🇰"},
        "no": {"name": "Norsk", "voice": "nb-NO-PernilleNeural", "flag": "🇳🇴"},
        "fi": {"name": "Suomi", "voice": "fi-FI-NooraNeural", "flag": "🇫🇮"},
        "el": {"name": "Ελληνικά", "voice": "el-GR-AthinaNeural", "flag": "🇬🇷"},
        "he": {"name": "עברית", "voice": "he-IL-HilaNeural", "flag": "🇮🇱"},
        "th": {"name": "ไทย", "voice": "th-TH-PremwadeeNeural", "flag": "🇹🇭"},
        "vi": {"name": "Tiếng Việt", "voice": "vi-VN-HoaiMyNeural", "flag": "🇻🇳"},
        "uk": {"name": "Українська", "voice": "uk-UA-PolinaNeural", "flag": "🇺🇦"},
        "ro": {"name": "Română", "voice": "ro-RO-AlinaNeural", "flag": "🇷🇴"},
        "cs": {"name": "Čeština", "voice": "cs-CZ-VlastaNeural", "flag": "🇨🇿"},
        "hu": {"name": "Magyar", "voice": "hu-HU-NoemiNeural", "flag": "🇭🇺"},
        "id": {"name": "Bahasa Indonesia", "voice": "id-ID-GadisNeural", "flag": "🇮🇩"},
        "ms": {"name": "Bahasa Melayu", "voice": "ms-MY-YasminNeural", "flag": "🇲🇾"},
    }

    model_config = {"env_prefix": "VOXMENTOR_", "env_file": ".env"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
