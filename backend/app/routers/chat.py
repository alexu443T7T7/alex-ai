"""Chat API endpoints."""

import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from ..models.schemas import ChatRequest, ChatResponse, SubjectCategory
from ..services.ollama_service import chat_with_ollama, stream_chat_with_ollama, get_session_info

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("/", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """Send a message and get a complete response."""
    try:
        response_text, session_id = await chat_with_ollama(
            message=request.message,
            session_id=request.session_id,
            language=request.language,
            subject=request.subject,
        )
        return ChatResponse(
            response=response_text,
            session_id=session_id,
            language=request.language,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error communicating with AI: {str(e)}")


@router.post("/stream")
async def stream_message(request: ChatRequest):
    """Send a message and stream the response via SSE."""

    async def event_generator():
        session_id = None
        try:
            async for chunk, sid in stream_chat_with_ollama(
                message=request.message,
                session_id=request.session_id,
                language=request.language,
                subject=request.subject,
            ):
                session_id = sid
                data = json.dumps({"chunk": chunk, "session_id": sid})
                yield f"data: {data}\n\n"

            yield f"data: {json.dumps({'done': True, 'session_id': session_id})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    )


@router.get("/session/{session_id}")
async def get_session(session_id: str):
    """Get session information."""
    info = get_session_info(session_id)
    if not info:
        raise HTTPException(status_code=404, detail="Session not found")
    return info


@router.get("/subjects")
async def list_subjects():
    """List available education subjects."""
    return [
        {"value": s.value, "label": _subject_labels.get(s.value, s.value)}
        for s in SubjectCategory
    ]


_subject_labels = {
    "languages": "🌍 Langues",
    "literature": "📚 Littérature",
    "philosophy": "🤔 Philosophie",
    "history": "🏛️ Histoire",
    "science": "🔬 Sciences",
    "mathematics": "📐 Mathématiques",
    "arts": "🎨 Arts",
    "music": "🎵 Musique",
    "geography": "🌎 Géographie",
    "general": "💡 Général",
}
