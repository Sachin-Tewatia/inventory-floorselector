"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mic, Trash2, Send } from "lucide-react";
import "./ChatInterface.css";

// Constants for storage
const CHAT_HISTORY_KEY = "convrse_inventory_chat_history";
const CHAT_MESSAGES_KEY = "convrse_inventory_chat_messages";
const CHAT_OPEN_STATE_KEY = "convrse_inventory_chat_open_state";
const LANGUAGE_KEY = "convrse_inventory_chat_language";

// Custom error class for quota exceeded
class QuotaExceededError extends Error {
    constructor(message, retryAfterSeconds = null) {
        super(message);
        this.name = "QuotaExceededError";
        this.retryAfterSeconds = retryAfterSeconds;
    }
}

// Supported languages
const LANGUAGES = [
    { code: "en-US", name: "English", script: "English" },
    { code: "te-IN", name: "Telugu", script: "తెలుగు" },
    { code: "ta-IN", name: "Tamil", script: "தமிழ்" },
    { code: "ml-IN", name: "Malayalam", script: "മലയാളം" },
    { code: "hi-IN", name: "Hindi", script: "हिंदी" },
    { code: "mr-IN", name: "Marathi", script: "मరాఠీ" },
    { code: "bn-IN", name: "Bengali", script: "বাংলা" },
    { code: "kn-IN", name: "Kannada", script: "ಕನ್ನಡ" },
    { code: "gu-IN", name: "Gujarati", script: "ગુજરાતી" },
    { code: "pa-IN", name: "Punjabi", script: "ਪੰਜਾਬੀ" },
    { code: "or-IN", name: "Odia", script: "ଓଡ଼ିଆ" },
    { code: "ur-IN", name: "Urdu", script: "اردو" },
    { code: "as-IN", name: "Assamese", script: "অসমীয়া" },
];

const LANGUAGE_CODE_MAP = {
    en: "en-US",
    te: "te-IN",
    ta: "ta-IN",
    ml: "ml-IN",
    hi: "hi-IN",
    mr: "mr-IN",
    bn: "bn-IN",
    kn: "kn-IN",
    gu: "gu-IN",
    pa: "pa-IN",
    or: "or-IN",
    ur: "ur-IN",
    as: "as-IN",
};

const detectUserLanguage = () => {
    try {
        const saved = localStorage.getItem(LANGUAGE_KEY);
        if (saved) return saved;

        if (typeof window !== "undefined" && navigator.languages) {
            for (const lang of navigator.languages) {
                const langParts = lang.split("-");
                const langCode = langParts[0]?.toLowerCase();
                if (!langCode) continue;

                if (LANGUAGE_CODE_MAP[langCode]) {
                    return LANGUAGE_CODE_MAP[langCode];
                }
            }
        }

        if (typeof window !== "undefined" && navigator.language) {
            const langParts = navigator.language.split("-");
            const langCode = langParts[0]?.toLowerCase();
            if (langCode && LANGUAGE_CODE_MAP[langCode]) {
                return LANGUAGE_CODE_MAP[langCode];
            }
        }
    } catch (error) {
        console.warn("Error detecting language:", error);
    }
    return "en-US";
};

export const getChatOpenState = () => {
    try {
        const saved = localStorage.getItem(CHAT_OPEN_STATE_KEY);
        return saved === "true";
    } catch (error) {
        console.warn("Error reading chat open state:", error);
        return false;
    }
};

export const setChatOpenState = (isOpen) => {
    try {
        localStorage.setItem(CHAT_OPEN_STATE_KEY, isOpen.toString());
    } catch (error) {
        console.warn("Error saving chat open state:", error);
    }
};

const normalizeHistory = (history) => {
    return history.map((item) => {
        if (item.content) {
            return { role: item.role, content: item.content };
        } else if (item.parts && item.parts.length > 0) {
            const text = item.parts.map((part) => part.text || "").join("");
            return { role: item.role, content: text };
        } else {
            return { role: item.role, content: "" };
        }
    });
};

const ChatInterface = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;

    const API_URL = "https://api.floorselector.convrse.ai/chat";
    const PROJECT_ID = "salarpuria";

    const [messages, setMessages] = useState([]);
    const [history, setHistory] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState("en-US");
    const [isListening, setIsListening] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContextRef = useRef(null);
    const activeAudioElementRef = useRef(null);
    const eventSourceRef = useRef(null);
    const audioQueueRef = useRef([]);
    const isPlayingQueueRef = useRef(false);

    const messagesEndRef = useRef(null);

    // Load initial data
    useEffect(() => {
        try {
            const savedMessages = localStorage.getItem(CHAT_MESSAGES_KEY);
            const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);

            const parsedMessages = savedMessages ? JSON.parse(savedMessages) : null;
            const parsedHistory = savedHistory ? JSON.parse(savedHistory) : [];

            if (parsedMessages && parsedMessages.length > 0) {
                setMessages(parsedMessages);
            } else {
                setMessages([
                    {
                        role: "assistant",
                        content: "Hi! How can I help you with unit availability or floor plans today?",
                        id: "welcome-msg-" + Date.now(),
                    },
                ]);
            }
            setHistory(parsedHistory);
            setSelectedLanguage(detectUserLanguage());
        } catch (e) {
            console.error(e);
        }
    }, []);

    // Save data
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (messages.length > 0) {
                localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages));
            }
            if (history.length > 0) {
                localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
            }
            localStorage.setItem(LANGUAGE_KEY, selectedLanguage);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [messages, history, selectedLanguage]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Audio Management
    const stopAudio = () => {
        if (activeAudioElementRef.current) {
            activeAudioElementRef.current.pause();
            activeAudioElementRef.current.currentTime = 0;
            activeAudioElementRef.current = null;
        }

        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }

        if (audioContextRef.current && audioContextRef.current.state !== "closed") {
            audioContextRef.current.close().catch(console.error);
            audioContextRef.current = null;
        }

        audioQueueRef.current = [];
        isPlayingQueueRef.current = false;
        setIsPlaying(false);
    };

    const playInlineAudio = (base64Audio, contentType) => {
        stopAudio();
        if (!base64Audio) return;

        try {
            const audioUrl = `data:${contentType};base64,${base64Audio}`;
            const audio = new Audio(audioUrl);
            activeAudioElementRef.current = audio;

            audio.onended = () => setIsPlaying(false);

            audio
                .play()
                .then(() => {
                    setIsPlaying(true);
                })
                .catch((e) => {
                    console.warn("Audio autoplay blocked:", e);
                    setIsPlaying(false);
                });
        } catch (e) {
            console.error("Error playing inline audio:", e);
        }
    };

    const playStreamAudio = (url) => {
        stopAudio();
        if (!url) return;

        try {
            new URL(url, window.location.origin);
        } catch (e) {
            console.error("Invalid audio stream URL:", url, e);
            setIsPlaying(false);
            return;
        }

        setIsPlaying(true);

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioCtx = new AudioContext();
            audioContextRef.current = audioCtx;

            const eventSource = new EventSource(url);
            eventSourceRef.current = eventSource;

            const processQueue = () => {
                if (isPlayingQueueRef.current || audioQueueRef.current.length === 0)
                    return;

                if (
                    !audioContextRef.current ||
                    audioContextRef.current.state === "closed"
                )
                    return;

                const buffer = audioQueueRef.current.shift();
                isPlayingQueueRef.current = true;

                const source = audioContextRef.current.createBufferSource();
                source.buffer = buffer;
                source.connect(audioContextRef.current.destination);

                source.onended = () => {
                    isPlayingQueueRef.current = false;
                    processQueue();
                };

                source.start(0);
            };

            eventSource.onmessage = async (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (data.type === "end" || data.status === "done") {
                        eventSource.close();
                        eventSourceRef.current = null;
                        return;
                    }

                    const audioContent = data.audio || data.audio_content;
                    if (audioContent) {
                        const binaryString = window.atob(audioContent);
                        const len = binaryString.length;
                        const bytes = new Uint8Array(len);
                        for (let i = 0; i < len; i++) {
                            bytes[i] = binaryString.charCodeAt(i);
                        }

                        const audioBuffer = await audioCtx.decodeAudioData(bytes.buffer);
                        audioQueueRef.current.push(audioBuffer);
                        processQueue();
                    }
                } catch (e) {
                    console.error("Error processing stream chunk:", e);
                }
            };

            eventSource.onerror = (err) => {
                if (eventSource.readyState === EventSource.CLOSED) {
                    stopAudio();
                }
            };
        } catch (e) {
            console.error("Error setting up audio stream:", e);
            setIsPlaying(false);
        }
    };

    useEffect(() => {
        return () => {
            stopAudio();
        };
    }, []);

    const handleSendMessage = async (textOverride = null) => {
        const text = textOverride || inputValue.trim();
        if (!text || isLoading) return;

        stopAudio();

        const userMsg = { role: "user", content: text, id: Date.now().toString() };
        setMessages((prev) => [...prev, userMsg]);
        setInputValue("");
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: text,
                    history: history,
                    language_code: selectedLanguage,
                    map_type: "inventory",
                    project_id: PROJECT_ID,
                    current_path: pathname,
                    user_id: localStorage.getItem("chat_user_id") || "guest",
                    session_id:
                        localStorage.getItem("chat_session_id") || `session_${Date.now()}`,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 429) {
                    const retryAfter = errorData.retry_after || 60;
                    throw new QuotaExceededError(
                        "Usage limit exceeded. Please try again later.",
                        retryAfter
                    );
                }
                const backendMessage =
                    errorData.message || errorData.detail || errorData.error;
                throw new Error(backendMessage || `API Error: ${response.status}`);
            }

            const data = await response.json();

            const assistantMsg = {
                role: "assistant",
                content: data.response || "I couldn't generate a response.",
                id: (Date.now() + 1).toString(),
            };

            setMessages((prev) => [...prev, assistantMsg]);

            if (data.history) {
                setHistory(normalizeHistory(data.history));
            }

            if (data.navigation_target) {
                navigate(data.navigation_target);
            }

            if (data.external_url) {
                window.open(data.external_url, "_blank");
            }

            if (data.highlighted_units) {
                handleHighlightUnits(data.highlighted_units);
            }

            if (data.audio_content && data.audio_content_type) {
                playInlineAudio(data.audio_content, data.audio_content_type);
            } else if (data.audio_stream_url) {
                playStreamAudio(data.audio_stream_url);
            }
        } catch (err) {
            console.error("Chat Error:", err);
            let errorMessage = "Sorry, I encountered an error. Please try again.";

            if (err instanceof QuotaExceededError) {
                errorMessage =
                    "You've reached the request limit. Please wait a moment.";
            } else if (err.message) {
                errorMessage = `Error: ${err.message}`;
            }

            setError(errorMessage);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: errorMessage,
                    id: (Date.now() + 1).toString(),
                    isError: true,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleHighlightUnits = (units) => {
        if (!units || units.length === 0) return;
        const unitEvent = new CustomEvent("CHAT_HIGHLIGHT_UNIT", {
            detail: { units },
        });
        window.dispatchEvent(unitEvent);
    };

    const startVoiceInput = () => {
        if (
            typeof window !== "undefined" &&
            ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
        ) {
            const SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = selectedLanguage || "en-IN";
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onerror = (e) => {
                console.error("Speech recognition error", e);
                setIsListening(false);
            };
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                if (transcript) {
                    setInputValue(transcript);
                    handleSendMessage(transcript);
                }
            };
            recognition.start();
        } else {
            alert("Voice input is not supported in this browser.");
        }
    };

    const clearChatHistory = () => {
        if (confirm("Clear chat history?")) {
            setMessages([
                {
                    role: "assistant",
                    content: "History cleared.",
                    id: Date.now().toString(),
                },
            ]);
            setHistory([]);
            localStorage.removeItem(CHAT_MESSAGES_KEY);
            localStorage.removeItem(CHAT_HISTORY_KEY);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <div>
                    <div className="chat-header-title">Inventory Assistant</div>
                    <div className="chat-header-subtitle">Ask me about towers, floors, and units</div>
                </div>
                <select
                    className="language-dropdown"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                    {LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code}>
                            {l.name}
                        </option>
                    ))}
                </select>
                <button
                    onClick={clearChatHistory}
                    className="ml-auto text-white/80 hover:text-white"
                    title="Clear chat history"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            <div className="chat-messages">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message-wrapper ${msg.role}`}>
                        <div className={`message ${msg.role}`}>
                            <div className="message-content">{msg.content}</div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="message-wrapper assistant">
                        <div className="message assistant">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
                <input
                    type="text"
                    className="chat-input"
                    placeholder={isListening ? "Listening..." : "Type your question..."}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={isLoading}
                />
                <button
                    className={`icon-button ${isListening ? "mic-active" : ""}`}
                    onClick={() => startVoiceInput()}
                    disabled={isLoading}
                    title="Voice Input"
                >
                    <Mic size={16} />
                </button>
                <button
                    className="icon-button send-button"
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isLoading}
                    title="Send message"
                >
                    <Send size={16} />
                </button>
            </div>
        </div>
    );
};

export default ChatInterface;
