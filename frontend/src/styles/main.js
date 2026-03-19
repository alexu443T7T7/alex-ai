/**
 * VoxMentor AI - Styles
 * Modern, clean UI optimized for voice interaction.
 */

export const styles = `
/* ===== Reset & Base ===== */
*, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary: #6366f1;
    --primary-light: #818cf8;
    --primary-dark: #4f46e5;
    --accent: #8b5cf6;
    --bg-dark: #0f0f23;
    --bg-card: #1a1a2e;
    --bg-elevated: #16213e;
    --text: #e2e8f0;
    --text-muted: #94a3b8;
    --text-bright: #f8fafc;
    --border: #2d2d44;
    --success: #22c55e;
    --error: #ef4444;
    --warning: #f59e0b;
    --user-bubble: #4f46e5;
    --assistant-bubble: #1e293b;
    --radius: 16px;
    --radius-sm: 10px;
    --shadow: 0 4px 24px rgba(0,0,0,0.3);
}

html, body {
    height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    background: var(--bg-dark);
    color: var(--text);
    overflow: hidden;
}

#app {
    height: 100%;
}

/* ===== App Layout ===== */
.voxmentor-app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-width: 900px;
    margin: 0 auto;
}

/* ===== Header ===== */
.app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    background: var(--bg-card);
    border-bottom: 1px solid var(--border);
    gap: 16px;
    flex-shrink: 0;
}

.header-left, .header-center, .header-right {
    display: flex;
    align-items: center;
    gap: 12px;
}

.logo {
    display: flex;
    align-items: center;
    gap: 10px;
}

.logo-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, var(--primary), var(--accent));
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 20px;
    color: white;
}

.logo-text h1 {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-bright);
    line-height: 1.2;
}

.tagline {
    font-size: 11px;
    color: var(--text-muted);
}

.selectors {
    display: flex;
    gap: 8px;
}

.selector {
    padding: 8px 12px;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text);
    font-size: 13px;
    cursor: pointer;
    outline: none;
    transition: border-color 0.2s;
}

.selector:hover, .selector:focus {
    border-color: var(--primary);
}

.selector option {
    background: var(--bg-dark);
}

.connection-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
}

.connection-dot.connected {
    background: var(--success);
    box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
}

.connection-dot.disconnected {
    background: var(--error);
    box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
}

.icon-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: var(--bg-elevated);
    color: var(--text);
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.icon-btn:hover {
    background: var(--primary);
    border-color: var(--primary);
}

/* ===== Main Content ===== */
.app-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* ===== Chat Area ===== */
.chat-area {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    scroll-behavior: smooth;
}

.chat-messages::-webkit-scrollbar {
    width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
    background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
    background: var(--border);
    border-radius: 3px;
}

/* ===== Messages ===== */
.message {
    display: flex;
    animation: fadeIn 0.3s ease;
}

.message.user {
    justify-content: flex-end;
}

.message.assistant {
    justify-content: flex-start;
}

.message.system {
    justify-content: center;
}

.message-bubble {
    max-width: 80%;
    padding: 12px 18px;
    border-radius: var(--radius);
    font-size: 15px;
    line-height: 1.6;
    position: relative;
    word-wrap: break-word;
}

.message.user .message-bubble {
    background: linear-gradient(135deg, var(--primary), var(--accent));
    color: white;
    border-bottom-right-radius: 4px;
}

.message.assistant .message-bubble {
    background: var(--assistant-bubble);
    color: var(--text);
    border-bottom-left-radius: 4px;
    border: 1px solid var(--border);
}

.message.system .message-bubble {
    background: transparent;
    color: var(--text-muted);
    font-size: 13px;
    font-style: italic;
    padding: 8px 16px;
}

.replay-btn {
    position: absolute;
    bottom: 4px;
    right: 4px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    opacity: 0.4;
    transition: opacity 0.2s;
    padding: 4px;
}

.replay-btn:hover {
    opacity: 1;
}

.interim-text {
    padding: 8px 20px;
    color: var(--text-muted);
    font-style: italic;
    font-size: 14px;
    background: var(--bg-card);
    border-top: 1px solid var(--border);
}

/* ===== Voice Control ===== */
.voice-control {
    padding: 16px 20px 20px;
    background: var(--bg-card);
    border-top: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
}

.voice-orb-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    position: relative;
}

.voice-orb {
    position: relative;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.orb-ring {
    position: absolute;
    border-radius: 50%;
    border: 2px solid var(--primary);
    opacity: 0;
    transition: all 0.3s;
}

.ring-1 { width: 100%; height: 100%; }
.ring-2 { width: 120%; height: 120%; }
.ring-3 { width: 140%; height: 140%; }

.voice-orb.listening .orb-ring {
    opacity: 0.3;
    animation: pulse 2s ease-in-out infinite;
}

.voice-orb.listening .ring-2 {
    animation-delay: 0.3s;
}

.voice-orb.listening .ring-3 {
    animation-delay: 0.6s;
}

.voice-orb.processing .orb-ring {
    opacity: 0.3;
    border-color: var(--warning);
    animation: spin 2s linear infinite;
}

.voice-orb.speaking .orb-ring {
    opacity: 0.3;
    border-color: var(--success);
    animation: pulse 1s ease-in-out infinite;
}

.mic-button {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, var(--primary), var(--accent));
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
    position: relative;
    z-index: 1;
}

.mic-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 28px rgba(99, 102, 241, 0.6);
}

.mic-button:active {
    transform: scale(0.95);
}

.mic-button.active {
    background: linear-gradient(135deg, #ef4444, #f97316);
    box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);
    animation: glow 1.5s ease-in-out infinite;
}

.mic-button.processing {
    background: linear-gradient(135deg, var(--warning), #f97316);
    animation: rotate-gradient 2s linear infinite;
}

.mic-button.speaking {
    background: linear-gradient(135deg, var(--success), #34d399);
    box-shadow: 0 4px 20px rgba(34, 197, 94, 0.4);
}

.status-text {
    font-size: 13px;
    color: var(--text-muted);
    text-align: center;
}

.stop-button {
    position: absolute;
    right: -50px;
    top: 50%;
    transform: translateY(-50%);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: var(--bg-elevated);
    color: var(--error);
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.stop-button:hover {
    background: var(--error);
    color: white;
}

/* ===== Text Input ===== */
.text-input-area {
    display: flex;
    gap: 8px;
    width: 100%;
    max-width: 600px;
}

.text-input {
    flex: 1;
    padding: 10px 16px;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: 24px;
    color: var(--text);
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
}

.text-input:focus {
    border-color: var(--primary);
}

.text-input::placeholder {
    color: var(--text-muted);
}

.send-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: var(--primary);
    color: white;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.send-btn:hover {
    background: var(--primary-dark);
}

.hint {
    font-size: 11px;
    color: var(--text-muted);
    opacity: 0.6;
}

.hint kbd {
    padding: 2px 6px;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: 4px;
    font-size: 11px;
}

/* ===== Animations ===== */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.05); opacity: 0.15; }
}

@keyframes glow {
    0%, 100% { box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4); }
    50% { box-shadow: 0 4px 30px rgba(239, 68, 68, 0.7); }
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
    .app-header {
        flex-wrap: wrap;
        padding: 10px 12px;
        gap: 8px;
    }

    .header-center {
        order: 3;
        width: 100%;
        justify-content: center;
    }

    .logo-text h1 {
        font-size: 15px;
    }

    .tagline {
        display: none;
    }

    .selector {
        font-size: 12px;
        padding: 6px 10px;
    }

    .chat-messages {
        padding: 12px;
    }

    .message-bubble {
        max-width: 90%;
        font-size: 14px;
    }

    .voice-orb {
        width: 70px;
        height: 70px;
    }

    .mic-button {
        width: 56px;
        height: 56px;
    }

    .mic-button svg {
        width: 26px;
        height: 26px;
    }
}

@media (max-width: 480px) {
    .selectors {
        flex-direction: column;
        gap: 4px;
    }
}
`;
