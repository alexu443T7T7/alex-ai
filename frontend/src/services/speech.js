/**
 * Speech Recognition service using Web Speech API.
 * Provides continuous, natural voice input.
 */

export class SpeechRecognitionService {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.onResult = null;
        this.onInterim = null;
        this.onStart = null;
        this.onEnd = null;
        this.onError = null;
        this.language = 'fr-FR';
        this._shouldRestart = false;
    }

    _getLanguageCode(lang) {
        const map = {
            'fr': 'fr-FR', 'en': 'en-US', 'es': 'es-ES', 'de': 'de-DE',
            'it': 'it-IT', 'pt': 'pt-BR', 'ru': 'ru-RU', 'zh': 'zh-CN',
            'ja': 'ja-JP', 'ko': 'ko-KR', 'ar': 'ar-SA', 'hi': 'hi-IN',
            'tr': 'tr-TR', 'pl': 'pl-PL', 'nl': 'nl-NL', 'sv': 'sv-SE',
            'da': 'da-DK', 'no': 'nb-NO', 'fi': 'fi-FI', 'el': 'el-GR',
            'he': 'he-IL', 'th': 'th-TH', 'vi': 'vi-VN', 'uk': 'uk-UA',
            'ro': 'ro-RO', 'cs': 'cs-CZ', 'hu': 'hu-HU', 'id': 'id-ID',
            'ms': 'ms-MY',
        };
        return map[lang] || lang;
    }

    isSupported() {
        return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    }

    init(language = 'fr') {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.error('Speech Recognition not supported');
            return false;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.language = this._getLanguageCode(language);
        this.recognition.lang = this.language;

        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            if (interimTranscript && this.onInterim) {
                this.onInterim(interimTranscript);
            }

            if (finalTranscript && this.onResult) {
                this.onResult(finalTranscript);
            }
        };

        this.recognition.onstart = () => {
            this.isListening = true;
            if (this.onStart) this.onStart();
        };

        this.recognition.onend = () => {
            this.isListening = false;
            if (this.onEnd) this.onEnd();
            // Auto-restart if we should keep listening
            if (this._shouldRestart) {
                setTimeout(() => {
                    if (this._shouldRestart) {
                        this.start();
                    }
                }, 100);
            }
        };

        this.recognition.onerror = (event) => {
            if (event.error === 'no-speech' || event.error === 'aborted') {
                // These are normal, auto-restart
                return;
            }
            console.error('Speech recognition error:', event.error);
            if (this.onError) this.onError(event.error);
        };

        return true;
    }

    setLanguage(language) {
        this.language = this._getLanguageCode(language);
        if (this.recognition) {
            this.recognition.lang = this.language;
        }
    }

    start() {
        if (!this.recognition) return;
        this._shouldRestart = true;
        try {
            this.recognition.start();
        } catch (e) {
            // Already started, ignore
        }
    }

    stop() {
        this._shouldRestart = false;
        if (this.recognition) {
            try {
                this.recognition.stop();
            } catch (e) {
                // Already stopped
            }
        }
        this.isListening = false;
    }
}


/**
 * Audio playback service for TTS responses.
 */
export class AudioPlayerService {
    constructor() {
        this.audioContext = null;
        this.currentAudio = null;
        this.isPlaying = false;
        this.onPlayStart = null;
        this.onPlayEnd = null;
        this.queue = [];
        this._processing = false;
    }

    _ensureContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    async playBlob(audioBlob) {
        this._ensureContext();

        return new Promise((resolve, reject) => {
            const audio = new Audio();
            const url = URL.createObjectURL(audioBlob);

            audio.onplay = () => {
                this.isPlaying = true;
                if (this.onPlayStart) this.onPlayStart();
            };

            audio.onended = () => {
                this.isPlaying = false;
                URL.revokeObjectURL(url);
                if (this.onPlayEnd) this.onPlayEnd();
                resolve();
            };

            audio.onerror = (e) => {
                this.isPlaying = false;
                URL.revokeObjectURL(url);
                reject(e);
            };

            this.currentAudio = audio;
            audio.src = url;
            audio.play().catch(reject);
        });
    }

    async addToQueue(audioBlob) {
        this.queue.push(audioBlob);
        if (!this._processing) {
            this._processing = true;
            while (this.queue.length > 0) {
                const blob = this.queue.shift();
                await this.playBlob(blob);
            }
            this._processing = false;
        }
    }

    stop() {
        this.queue = [];
        this._processing = false;
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }
        this.isPlaying = false;
    }
}
