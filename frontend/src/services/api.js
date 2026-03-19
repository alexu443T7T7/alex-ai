/**
 * API service for communicating with the VoxMentor backend.
 */

const API_BASE = '/api';

export async function sendMessage(message, sessionId, language, subject) {
    const response = await fetch(`${API_BASE}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message,
            session_id: sessionId,
            language,
            subject,
        }),
    });

    if (!response.ok) {
        throw new Error(`Chat error: ${response.status}`);
    }

    return response.json();
}

export async function streamMessage(message, sessionId, language, subject, onChunk, onDone) {
    const response = await fetch(`${API_BASE}/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message,
            session_id: sessionId,
            language,
            subject,
        }),
    });

    if (!response.ok) {
        throw new Error(`Stream error: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                try {
                    const data = JSON.parse(line.slice(6));
                    if (data.error) {
                        throw new Error(data.error);
                    }
                    if (data.done) {
                        onDone(data.session_id);
                    } else if (data.chunk) {
                        onChunk(data.chunk, data.session_id);
                    }
                } catch (e) {
                    if (e.message !== 'Unexpected end of JSON input') {
                        console.error('Stream parse error:', e);
                    }
                }
            }
        }
    }
}

export async function synthesizeSpeech(text, language, voice = null) {
    const response = await fetch(`${API_BASE}/tts/synthesize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language, voice }),
    });

    if (!response.ok) {
        throw new Error(`TTS error: ${response.status}`);
    }

    return response.blob();
}

export async function getLanguages() {
    const response = await fetch(`${API_BASE}/languages/`);
    if (!response.ok) throw new Error('Failed to fetch languages');
    return response.json();
}

export async function getSubjects() {
    const response = await fetch(`${API_BASE}/chat/subjects`);
    if (!response.ok) throw new Error('Failed to fetch subjects');
    return response.json();
}

export async function healthCheck() {
    const response = await fetch(`${API_BASE}/health`);
    return response.json();
}
