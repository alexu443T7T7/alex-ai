/**
 * VoxMentor AI - Main Application Component
 * A fully voice-driven AI education SaaS.
 */

import { SpeechRecognitionService, AudioPlayerService } from '../services/speech.js';
import { sendMessage, synthesizeSpeech, getLanguages, getSubjects, healthCheck } from '../services/api.js';
import { styles } from '../styles/main.js';

export class VoxMentorApp {
    constructor(container) {
        this.container = container;
        this.speechRecognition = new SpeechRecognitionService();
        this.audioPlayer = new AudioPlayerService();

        // State
        this.sessionId = null;
        this.language = 'fr';
        this.subject = 'general';
        this.isListening = false;
        this.isProcessing = false;
        this.isSpeaking = false;
        this.languages = [];
        this.subjects = [];
        this.messages = [];
        this.interimText = '';
        this.status = 'idle'; // idle, listening, processing, speaking
    }

    async init() {
        this.render();
        this.injectStyles();
        this.bindEvents();
        await this.loadData();
        this.initSpeechRecognition();
        this.showWelcome();
    }

    injectStyles() {
        const styleEl = document.createElement('style');
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);
    }

    async loadData() {
        try {
            const [langData, subjectData] = await Promise.all([
                getLanguages(),
                getSubjects(),
            ]);
            this.languages = langData.languages;
            this.subjects = subjectData;
            this.renderSelectors();
        } catch (e) {
            console.warn('Could not load data from API, using defaults:', e.message);
        }

        try {
            await healthCheck();
            this.setConnectionStatus(true);
        } catch {
            this.setConnectionStatus(false);
        }
    }

    initSpeechRecognition() {
        if (!this.speechRecognition.isSupported()) {
            this.addSystemMessage("Votre navigateur ne supporte pas la reconnaissance vocale. Veuillez utiliser Chrome ou Edge.");
            return;
        }

        this.speechRecognition.init(this.language);

        this.speechRecognition.onResult = (text) => {
            this.interimText = '';
            this.updateInterimDisplay();
            this.handleUserMessage(text);
        };

        this.speechRecognition.onInterim = (text) => {
            this.interimText = text;
            this.updateInterimDisplay();
        };

        this.speechRecognition.onStart = () => {
            this.isListening = true;
            this.setStatus('listening');
        };

        this.speechRecognition.onEnd = () => {
            if (!this.isProcessing && !this.isSpeaking) {
                this.isListening = false;
                this.setStatus('idle');
            }
        };

        this.speechRecognition.onError = (error) => {
            this.addSystemMessage(`Erreur de reconnaissance vocale: ${error}`);
        };

        this.audioPlayer.onPlayStart = () => {
            this.isSpeaking = true;
            this.setStatus('speaking');
        };

        this.audioPlayer.onPlayEnd = () => {
            this.isSpeaking = false;
            if (this.isListening) {
                this.setStatus('listening');
            } else {
                this.setStatus('idle');
            }
        };
    }

    showWelcome() {
        this.addAssistantMessage(
            "Bonjour ! Je suis VoxMentor, votre professeur vocal intelligent. " +
            "Je peux vous enseigner les langues, la littérature, la philosophie, " +
            "l'histoire, les sciences et bien plus encore. " +
            "Appuyez sur le microphone et parlez-moi !"
        );
    }

    async handleUserMessage(text) {
        if (!text.trim()) return;

        // Stop listening while processing
        this.speechRecognition.stop();
        this.isProcessing = true;
        this.setStatus('processing');

        this.addUserMessage(text);

        try {
            const response = await sendMessage(text, this.sessionId, this.language, this.subject);
            this.sessionId = response.session_id;

            this.addAssistantMessage(response.response);

            // Synthesize and play the response
            this.setStatus('speaking');
            const audioBlob = await synthesizeSpeech(response.response, this.language);
            await this.audioPlayer.playBlob(audioBlob);
        } catch (e) {
            console.error('Error:', e);
            this.addSystemMessage(`Erreur: ${e.message}. Vérifiez qu'Ollama est lancé avec le modèle Mistral.`);
        } finally {
            this.isProcessing = false;
            this.setStatus('idle');
        }
    }

    async handleTextInput(text) {
        if (!text.trim()) return;
        this.speechRecognition.stop();
        this.isProcessing = true;
        this.setStatus('processing');
        this.addUserMessage(text);

        try {
            const response = await sendMessage(text, this.sessionId, this.language, this.subject);
            this.sessionId = response.session_id;
            this.addAssistantMessage(response.response);

            const audioBlob = await synthesizeSpeech(response.response, this.language);
            await this.audioPlayer.playBlob(audioBlob);
        } catch (e) {
            console.error('Error:', e);
            this.addSystemMessage(`Erreur: ${e.message}`);
        } finally {
            this.isProcessing = false;
            this.setStatus('idle');
        }
    }

    toggleListening() {
        if (this.isListening) {
            this.speechRecognition.stop();
            this.isListening = false;
            this.setStatus('idle');
        } else {
            this.audioPlayer.stop();
            this.speechRecognition.setLanguage(this.language);
            this.speechRecognition.start();
        }
    }

    stopSpeaking() {
        this.audioPlayer.stop();
        this.isSpeaking = false;
        this.setStatus('idle');
    }

    setStatus(status) {
        this.status = status;
        const statusEl = document.getElementById('status-indicator');
        const micBtn = document.getElementById('mic-button');
        const statusText = document.getElementById('status-text');
        const orb = document.getElementById('voice-orb');

        if (!statusEl) return;

        // Remove all status classes
        orb?.classList.remove('listening', 'processing', 'speaking');
        micBtn?.classList.remove('active', 'processing', 'speaking');

        const statusMessages = {
            idle: { text: 'Appuyez pour parler', icon: '🎙️' },
            listening: { text: 'Je vous écoute...', icon: '👂' },
            processing: { text: 'Je réfléchis...', icon: '🧠' },
            speaking: { text: 'Je parle...', icon: '🗣️' },
        };

        const s = statusMessages[status] || statusMessages.idle;
        if (statusText) statusText.textContent = s.text;

        if (status !== 'idle') {
            orb?.classList.add(status);
            micBtn?.classList.add(status === 'listening' ? 'active' : status);
        }
    }

    setConnectionStatus(connected) {
        const dot = document.getElementById('connection-dot');
        if (dot) {
            dot.className = `connection-dot ${connected ? 'connected' : 'disconnected'}`;
            dot.title = connected ? 'Connecté au serveur' : 'Serveur non disponible';
        }
    }

    addUserMessage(text) {
        this.messages.push({ role: 'user', content: text });
        this.renderMessage('user', text);
    }

    addAssistantMessage(text) {
        this.messages.push({ role: 'assistant', content: text });
        this.renderMessage('assistant', text);
    }

    addSystemMessage(text) {
        this.renderMessage('system', text);
    }

    renderMessage(role, content) {
        const chat = document.getElementById('chat-messages');
        if (!chat) return;

        const msg = document.createElement('div');
        msg.className = `message ${role}`;

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.textContent = content;

        // Add replay button for assistant messages
        if (role === 'assistant') {
            const replay = document.createElement('button');
            replay.className = 'replay-btn';
            replay.innerHTML = '🔊';
            replay.title = 'Réécouter';
            replay.onclick = async () => {
                try {
                    const blob = await synthesizeSpeech(content, this.language);
                    await this.audioPlayer.playBlob(blob);
                } catch (e) {
                    console.error('Replay error:', e);
                }
            };
            bubble.appendChild(replay);
        }

        msg.appendChild(bubble);
        chat.appendChild(msg);
        chat.scrollTop = chat.scrollHeight;
    }

    updateInterimDisplay() {
        const interim = document.getElementById('interim-text');
        if (interim) {
            interim.textContent = this.interimText;
            interim.style.display = this.interimText ? 'block' : 'none';
        }
    }

    renderSelectors() {
        // Language selector
        const langSelect = document.getElementById('language-select');
        if (langSelect && this.languages.length) {
            langSelect.innerHTML = this.languages.map(l =>
                `<option value="${l.code}" ${l.code === this.language ? 'selected' : ''}>${l.flag} ${l.name}</option>`
            ).join('');
        }

        // Subject selector
        const subjectSelect = document.getElementById('subject-select');
        if (subjectSelect && this.subjects.length) {
            subjectSelect.innerHTML = this.subjects.map(s =>
                `<option value="${s.value}" ${s.value === this.subject ? 'selected' : ''}>${s.label}</option>`
            ).join('');
        }
    }

    bindEvents() {
        // Mic button
        this.container.addEventListener('click', (e) => {
            if (e.target.closest('#mic-button')) {
                this.toggleListening();
            }
            if (e.target.closest('#stop-button')) {
                this.stopSpeaking();
            }
            if (e.target.closest('#new-session-btn')) {
                this.sessionId = null;
                this.messages = [];
                const chat = document.getElementById('chat-messages');
                if (chat) chat.innerHTML = '';
                this.showWelcome();
            }
        });

        // Language change
        this.container.addEventListener('change', (e) => {
            if (e.target.id === 'language-select') {
                this.language = e.target.value;
                this.speechRecognition.setLanguage(this.language);
            }
            if (e.target.id === 'subject-select') {
                this.subject = e.target.value;
            }
        });

        // Text input (fallback)
        this.container.addEventListener('keydown', (e) => {
            if (e.target.id === 'text-input' && e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const input = e.target;
                if (input.value.trim()) {
                    this.handleTextInput(input.value.trim());
                    input.value = '';
                }
            }
        });

        this.container.addEventListener('click', (e) => {
            if (e.target.id === 'send-text-btn') {
                const input = document.getElementById('text-input');
                if (input && input.value.trim()) {
                    this.handleTextInput(input.value.trim());
                    input.value = '';
                }
            }
        });

        // Keyboard shortcut: space to toggle mic
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                this.toggleListening();
            }
        });
    }

    render() {
        this.container.innerHTML = `
            <div class="voxmentor-app">
                <!-- Header -->
                <header class="app-header">
                    <div class="header-left">
                        <div class="logo">
                            <div class="logo-icon">V</div>
                            <div class="logo-text">
                                <h1>VoxMentor AI</h1>
                                <span class="tagline">Votre Professeur Vocal Intelligent</span>
                            </div>
                        </div>
                    </div>
                    <div class="header-center">
                        <div class="selectors">
                            <select id="language-select" class="selector">
                                <option value="fr">🇫🇷 Français</option>
                            </select>
                            <select id="subject-select" class="selector">
                                <option value="general">💡 Général</option>
                            </select>
                        </div>
                    </div>
                    <div class="header-right">
                        <span id="connection-dot" class="connection-dot disconnected" title="Vérification..."></span>
                        <button id="new-session-btn" class="icon-btn" title="Nouvelle conversation">↻</button>
                    </div>
                </header>

                <!-- Main content -->
                <main class="app-main">
                    <!-- Chat area -->
                    <div class="chat-area">
                        <div id="chat-messages" class="chat-messages"></div>
                        <div id="interim-text" class="interim-text" style="display:none"></div>
                    </div>

                    <!-- Voice control area -->
                    <div class="voice-control">
                        <div class="voice-orb-container">
                            <div id="voice-orb" class="voice-orb">
                                <div class="orb-ring ring-1"></div>
                                <div class="orb-ring ring-2"></div>
                                <div class="orb-ring ring-3"></div>
                                <button id="mic-button" class="mic-button" title="Appuyez pour parler (ou Espace)">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                                    </svg>
                                </button>
                            </div>
                            <p id="status-text" class="status-text">Appuyez pour parler</p>
                            <button id="stop-button" class="stop-button" title="Arrêter">■</button>
                        </div>

                        <!-- Text input fallback -->
                        <div class="text-input-area">
                            <input type="text" id="text-input" class="text-input"
                                   placeholder="Ou tapez votre message ici..." />
                            <button id="send-text-btn" class="send-btn">➤</button>
                        </div>
                        <p class="hint">Appuyez sur <kbd>Espace</kbd> pour activer le micro</p>
                    </div>
                </main>
            </div>
        `;
    }
}
