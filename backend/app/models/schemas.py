"""Pydantic schemas for API requests and responses."""

from pydantic import BaseModel
from enum import Enum


class SubjectCategory(str, Enum):
    LANGUAGES = "languages"
    LITERATURE = "literature"
    PHILOSOPHY = "philosophy"
    HISTORY = "history"
    SCIENCE = "science"
    MATHEMATICS = "mathematics"
    ARTS = "arts"
    MUSIC = "music"
    GEOGRAPHY = "geography"
    GENERAL = "general"


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None
    language: str = "fr"
    subject: SubjectCategory = SubjectCategory.GENERAL


class ChatResponse(BaseModel):
    response: str
    session_id: str
    language: str
    detected_language: str | None = None


class TTSRequest(BaseModel):
    text: str
    language: str = "fr"
    voice: str | None = None


class LanguageInfo(BaseModel):
    code: str
    name: str
    flag: str
    voice: str


class SessionInfo(BaseModel):
    session_id: str
    language: str
    subject: SubjectCategory
    message_count: int
