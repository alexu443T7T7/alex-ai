"""Service for interacting with Ollama Mistral model."""

import httpx
import json
import uuid
from typing import AsyncGenerator

from ..core.config import get_settings
from ..models.schemas import ChatMessage, SubjectCategory

settings = get_settings()

# In-memory session storage
_sessions: dict[str, dict] = {}


def _get_system_prompt(language: str, subject: SubjectCategory) -> str:
    """Build the system prompt based on language and subject."""

    lang_names = {v["name"]: k for k, v in settings.language_voices.items()}
    lang_name = settings.language_voices.get(language, {}).get("name", "Français")

    base_prompt = f"""Tu es VoxMentor, un professeur d'éducation universel extraordinaire, chaleureux et passionné.
Tu enseignes par la voix — tes réponses seront lues à haute voix, donc elles doivent être naturelles, fluides et conversationnelles.

RÈGLES ABSOLUES :
1. Tu réponds TOUJOURS dans la langue demandée : {lang_name} ({language}).
2. Tu parles de manière naturelle comme un vrai professeur passionné — avec des intonations, des pauses naturelles, des expressions idiomatiques.
3. Tu ne fais JAMAIS de formatage markdown (pas de **, pas de #, pas de listes à puces). Tu parles comme à l'oral.
4. Tes réponses sont structurées pour l'écoute : phrases claires, courtes à moyennes, avec des transitions naturelles.
5. Tu es patient, encourageant, et tu t'adaptes au niveau de l'apprenant.
6. Si on te demande d'enseigner une langue, tu utilises la méthode immersive : tu parles dans cette langue avec des explications.
7. Tu utilises des exemples concrets, des anecdotes, des métaphores pour rendre l'apprentissage vivant.
8. Tu poses régulièrement des questions pour engager la conversation et vérifier la compréhension.
9. Tu peux basculer entre les langues de manière fluide si l'apprenant le demande.
10. Tu es capable d'enseigner : langues, littérature, philosophie, histoire, sciences, mathématiques, arts, musique, géographie, et tout sujet académique."""

    subject_additions = {
        SubjectCategory.LANGUAGES: """
Tu es spécialisé dans l'enseignement des langues. Tu utilises la méthode immersive.
Tu corriges la prononciation, tu enseignes la grammaire de manière intuitive, tu fais pratiquer avec des dialogues réalistes.
Tu connais les subtilités, les expressions idiomatiques, l'argot et les registres de langue de chaque langue.""",

        SubjectCategory.LITERATURE: """
Tu es un expert en littérature mondiale. Tu connais les grands auteurs de toutes les cultures.
Tu analyses les œuvres avec passion, tu fais des liens entre les époques et les mouvements littéraires.
Tu récites des passages célèbres et tu les expliques avec enthousiasme.""",

        SubjectCategory.PHILOSOPHY: """
Tu es un philosophe érudit. Tu connais toutes les écoles de pensée, de Socrate aux philosophes contemporains.
Tu rends la philosophie accessible et passionnante. Tu poses des questions socratiques pour faire réfléchir.
Tu relies la philosophie à la vie quotidienne et aux enjeux actuels.""",

        SubjectCategory.HISTORY: """
Tu es un historien passionnant qui raconte l'Histoire comme une grande saga.
Tu connais l'histoire de toutes les civilisations et tu fais des parallèles entre les époques.
Tu racontes des anecdotes fascinantes et tu analyses les causes et conséquences des événements.""",

        SubjectCategory.SCIENCE: """
Tu es un scientifique passionné qui rend la science accessible et fascinante.
Tu expliques les concepts complexes avec des analogies simples et des expériences de pensée.
Tu couvres la physique, la chimie, la biologie, l'astronomie et les sciences de la Terre.""",

        SubjectCategory.MATHEMATICS: """
Tu es un mathématicien qui rend les maths intuitives et belles.
Tu expliques les concepts pas à pas, tu utilises des exemples concrets du quotidien.
Tu montres la beauté et l'élégance des mathématiques dans la nature et l'art.""",

        SubjectCategory.ARTS: """
Tu es un expert en histoire de l'art et en pratique artistique.
Tu connais tous les mouvements artistiques, les grands maîtres, et tu sais décrire les œuvres de manière vivante.
Tu enseignes les techniques et tu inspires la créativité.""",

        SubjectCategory.MUSIC: """
Tu es un musicologue passionné. Tu connais tous les genres musicaux du monde entier.
Tu enseignes la théorie musicale, l'histoire de la musique, et tu sais décrire les sons et les émotions musicales.
Tu peux enseigner le solfège, l'harmonie et l'analyse musicale de manière orale.""",

        SubjectCategory.GEOGRAPHY: """
Tu es un géographe et voyageur du monde. Tu connais chaque pays, chaque culture, chaque paysage.
Tu décris les lieux de manière immersive et tu enseignes la géographie physique et humaine avec passion.""",
    }

    if subject in subject_additions:
        base_prompt += subject_additions[subject]

    return base_prompt


def get_or_create_session(session_id: str | None, language: str, subject: SubjectCategory) -> tuple[str, list[dict]]:
    """Get existing session or create a new one."""
    if session_id and session_id in _sessions:
        session = _sessions[session_id]
        session["language"] = language
        session["subject"] = subject
        return session_id, session["messages"]

    new_id = session_id or str(uuid.uuid4())
    _sessions[new_id] = {
        "messages": [],
        "language": language,
        "subject": subject,
    }
    return new_id, _sessions[new_id]["messages"]


def get_session_info(session_id: str) -> dict | None:
    """Get session information."""
    if session_id in _sessions:
        s = _sessions[session_id]
        return {
            "session_id": session_id,
            "language": s["language"],
            "subject": s["subject"],
            "message_count": len(s["messages"]),
        }
    return None


async def chat_with_ollama(
    message: str,
    session_id: str | None,
    language: str,
    subject: SubjectCategory,
) -> tuple[str, str]:
    """Send a message to Ollama and get a response."""
    sid, history = get_or_create_session(session_id, language, subject)
    system_prompt = _get_system_prompt(language, subject)

    # Build messages for Ollama
    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(history[-settings.session_max_history:])
    messages.append({"role": "user", "content": message})

    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            f"{settings.ollama_base_url}/api/chat",
            json={
                "model": settings.ollama_model,
                "messages": messages,
                "stream": False,
                "options": {
                    "temperature": 0.8,
                    "top_p": 0.9,
                    "num_predict": 1024,
                },
            },
        )
        response.raise_for_status()
        data = response.json()

    assistant_message = data["message"]["content"]

    # Update session history
    history.append({"role": "user", "content": message})
    history.append({"role": "assistant", "content": assistant_message})

    # Trim history if needed
    if len(history) > settings.session_max_history * 2:
        _sessions[sid]["messages"] = history[-settings.session_max_history:]

    return assistant_message, sid


async def stream_chat_with_ollama(
    message: str,
    session_id: str | None,
    language: str,
    subject: SubjectCategory,
) -> AsyncGenerator[tuple[str, str], None]:
    """Stream a response from Ollama."""
    sid, history = get_or_create_session(session_id, language, subject)
    system_prompt = _get_system_prompt(language, subject)

    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(history[-settings.session_max_history:])
    messages.append({"role": "user", "content": message})

    full_response = ""

    async with httpx.AsyncClient(timeout=120.0) as client:
        async with client.stream(
            "POST",
            f"{settings.ollama_base_url}/api/chat",
            json={
                "model": settings.ollama_model,
                "messages": messages,
                "stream": True,
                "options": {
                    "temperature": 0.8,
                    "top_p": 0.9,
                    "num_predict": 1024,
                },
            },
        ) as response:
            async for line in response.aiter_lines():
                if line:
                    data = json.loads(line)
                    if "message" in data and "content" in data["message"]:
                        chunk = data["message"]["content"]
                        full_response += chunk
                        yield chunk, sid

    # Update session history
    history.append({"role": "user", "content": message})
    history.append({"role": "assistant", "content": full_response})
