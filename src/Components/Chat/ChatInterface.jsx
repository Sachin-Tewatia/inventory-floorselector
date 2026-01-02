"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mic, Trash2, Send } from "lucide-react";
import "./ChatInterface.css";
import { sendChatMessage, PROJECT_ID, baseURL } from "../../APIs";

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

const normalizeNavigationTarget = (target, projectId) => {
    if (!target) return target;

    let normalized = target;

    // 1. Replace project ID with base path
    if (normalized.startsWith(`/${projectId}`)) {
        normalized = normalized.replace(`/${projectId}`, "/inspire");
    }

    // 2. Handle Floor Pattern: /floor/t11_3 -> /tower/cluster11/floor/3
    const floorPatternMatch = normalized.match(/\/floor\/t(\d+)_(\d+)/i);
    if (floorPatternMatch) {
        normalized = `/inspire/tower/cluster${floorPatternMatch[1]}/floor/${floorPatternMatch[2]}`;
        return normalized;
    }

    // 3. Handle Tower Patterns
    // General tower cleanup
    normalized = normalized.replace(/tower%20/gi, "cluster");
    normalized = normalized.replace(/tower\s+/gi, "cluster");

    // Specific match for /tower/10 or /tower/t11 -> /tower/cluster11
    normalized = normalized.replace(/\/tower\/(?:cluster|t|)(\d+)/i, "/tower/cluster$1");

    return normalized;
};

const ChatInterface = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;

    // const API_URL = "https://api.floorselector.convrse.ai/api/chat";
    // const PROJECT_ID = "salarpuria";

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

    const setupEventSource = (url, audioCtx) => {
        try {
            const eventSource = new EventSource(url);
            eventSourceRef.current = eventSource;
            console.log("📡 EventSource created for:", url);
            console.log("📡 EventSource initial readyState:", eventSource.readyState);

            // Monitor readyState changes
            const checkState = setInterval(() => {
                if (eventSource.readyState !== EventSource.CONNECTING) {
                    console.log("📡 EventSource readyState changed to:",
                        eventSource.readyState === EventSource.OPEN ? "OPEN" :
                            eventSource.readyState === EventSource.CLOSED ? "CLOSED" : "UNKNOWN");
                    clearInterval(checkState);
                }
            }, 100);

            // Timeout if connection takes too long
            const connectionTimeout = setTimeout(() => {
                if (eventSource.readyState === EventSource.CONNECTING) {
                    console.error("❌ EventSource connection timeout - still CONNECTING after 10s");
                    eventSource.close();
                    stopAudio();
                }
            }, 10000);

            let audioMetadata = null;

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
                console.log("▶️ Playing audio buffer, queue length:", audioQueueRef.current.length);

                const source = audioContextRef.current.createBufferSource();
                source.buffer = buffer;
                source.connect(audioContextRef.current.destination);

                source.onended = () => {
                    isPlayingQueueRef.current = false;
                    console.log("✅ Audio buffer finished playing");
                    processQueue();
                };

                source.start(0);
            };

            // Convert PCM data to AudioBuffer
            const convertPCMToAudioBuffer = async (arrayBuffer, sampleRate = 24000) => {
                try {
                    const int16Array = new Int16Array(arrayBuffer);
                    const float32Array = new Float32Array(int16Array.length);

                    // Convert Int16 PCM to Float32 for Web Audio API
                    for (let i = 0; i < int16Array.length; i++) {
                        float32Array[i] = int16Array[i] / 32768.0;
                    }

                    const buffer = audioCtx.createBuffer(1, float32Array.length, sampleRate);
                    buffer.getChannelData(0).set(float32Array);
                    return buffer;
                } catch (e) {
                    console.error("❌ Error in convertPCMToAudioBuffer:", e);
                    throw e;
                }
            };

            eventSource.onopen = () => {
                console.log("✅ EventSource connection opened successfully");
                clearTimeout(connectionTimeout);
            };

            // Generic message handler to see if events are arriving without names
            eventSource.onmessage = (event) => {
                console.log("📨 Received unnamed message event:", event.data?.length, "bytes");
            };

            // Listen for metadata event
            eventSource.addEventListener('metadata', (event) => {
                console.log("📊 Received metadata event:", event.data);
                try {
                    audioMetadata = JSON.parse(event.data);
                    console.log("📊 Audio metadata parsed:", audioMetadata);
                } catch (e) {
                    console.error("❌ Error parsing metadata:", e);
                }
            });

            // Listen for audio_chunk events
            eventSource.addEventListener('audio_chunk', async (event) => {
                console.log("🎵 Received audio_chunk event, data length:", event.data?.length);
                if (!event.data) {
                    console.warn("⚠️ Received empty audio_chunk");
                    return;
                }

                try {
                    const base64Data = event.data?.trim();
                    if (!base64Data) {
                        console.warn("⚠️ Empty data in audio_chunk event");
                        return;
                    }
                    // Decode base64 to ArrayBuffer
                    const binaryString = window.atob(base64Data);
                    const arrayBuffer = new ArrayBuffer(binaryString.length);
                    const uint8Array = new Uint8Array(arrayBuffer);

                    for (let i = 0; i < binaryString.length; i++) {
                        uint8Array[i] = binaryString.charCodeAt(i);
                    }

                    // Convert PCM to AudioBuffer
                    const sampleRate = audioMetadata?.sample_rate || 24000;
                    console.log("🎵 Decoding chunk with sample rate:", sampleRate);
                    const audioBuffer = await convertPCMToAudioBuffer(arrayBuffer, sampleRate);
                    console.log("✅ Audio decoded, duration:", audioBuffer.duration.toFixed(3), "s");

                    audioQueueRef.current.push(audioBuffer);
                    processQueue();
                } catch (e) {
                    console.error("❌ Error processing audio_chunk:", e);
                }
            });

            // Listen for complete event
            eventSource.addEventListener('complete', (event) => {
                console.log("🏁 Received complete event");
                eventSource.close();
                eventSourceRef.current = null;
                clearTimeout(connectionTimeout);
            });

            // Listen for error event (named error event from server)
            // Note: We listen for both 'error' and 'error_event' to be safe
            const errorHandler = (event) => {
                console.error("❌ Received error event:", event);
                if (event.data) {
                    try {
                        const errorData = JSON.parse(event.data);
                        console.error("❌ Backend error details:", errorData);

                        if (errorData.type === 'model_error' || errorData.error?.includes('model')) {
                            console.warn("⚠️ Audio generation permanently failed – stopping playback and closing connection");
                            if (eventSourceRef.current) {
                                eventSourceRef.current.close();
                                eventSourceRef.current = null;
                            }
                            stopAudio();
                            setIsPlaying(false);
                            return;
                        }
                    } catch (e) {
                        console.error("❌ Could not parse error data:", event.data);
                    }
                }
            };

            eventSource.addEventListener('error', errorHandler);
            eventSource.addEventListener('error_event', errorHandler);

            // Listen for highlighted units streamed during audio
            eventSource.addEventListener('highlight_units', (event) => {
                console.log("🔦 Received highlight_units event:", event.data);
                try {
                    const data = JSON.parse(event.data);
                    const units = data.units || data;
                    if (Array.isArray(units)) {
                        handleHighlightUnits(units);
                    }
                } catch (e) {
                    console.error("❌ Error parsing highlight_units:", e);
                }
            });

            // Listen for highlighted locations streamed during audio
            eventSource.addEventListener('highlight_locations', (event) => {
                console.log("📍 Received highlight_locations event:", event.data);
                try {
                    const data = JSON.parse(event.data);
                    const locations = data.locations || data;
                    if (Array.isArray(locations)) {
                        const locEvent = new CustomEvent("CHAT_HIGHLIGHT_LOCATION", {
                            detail: { locations },
                        });
                        window.dispatchEvent(locEvent);
                    }
                } catch (e) {
                    console.error("❌ Error parsing highlight_locations:", e);
                }
            });

            // Listen for navigation targets streamed during audio
            eventSource.addEventListener('navigation_target', (event) => {
                console.log("🧭 Received navigation_target event:", event.data);
                try {
                    let target = event.data;
                    if (target.startsWith("{")) {
                        target = JSON.parse(target).target || target;
                    }

                    if (target) {
                        const normalizedTarget = normalizeNavigationTarget(target, PROJECT_ID);
                        console.log("🧭 Navigating to normalized target:", normalizedTarget);
                        navigate(normalizedTarget);
                    }
                } catch (e) {
                    console.error("❌ Error parsing navigation_target:", e);
                }
            });

            eventSource.onerror = (err) => {
                console.error("❌ EventSource connection error notification:", err);
                console.log("📡 EventSource readyState at error:", eventSource.readyState);

                // For EventSource, readyState 2 (CLOSED) means it failed to connect or was closed by server
                if (eventSource.readyState === EventSource.CLOSED) {
                    console.log("🔌 EventSource connection closed");
                    // Don't stopAudio immediately if we have chunks left in queue
                    if (audioQueueRef.current.length === 0 && !isPlayingQueueRef.current) {
                        setIsPlaying(false);
                    }
                    clearTimeout(connectionTimeout);
                } else if (eventSource.readyState === EventSource.CONNECTING) {
                    console.warn("📡 EventSource is disconnected and attempting to reconnect...");
                }
            };
        } catch (e) {
            console.error("❌ Error setting up event source:", e);
            setIsPlaying(false);
        }
    };

    const playStreamAudio = (url) => {
        console.log("🔊 playStreamAudio called with URL:", url);
        stopAudio();
        if (!url) {
            console.warn("⚠️ No audio stream URL provided");
            return;
        }

        try {
            new URL(url, window.location.origin);
            console.log("✅ Audio stream URL is valid");
        } catch (e) {
            console.error("❌ Invalid audio stream URL:", url, e);
            setIsPlaying(false);
            return;
        }

        setIsPlaying(true);
        console.log("🎵 Starting audio stream playback...");

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) {
                console.error("❌ AudioContext not supported in this browser");
                setIsPlaying(false);
                return;
            }

            // Reuse or create AudioContext
            let audioCtx = audioContextRef.current;
            if (!audioCtx || audioCtx.state === "closed") {
                audioCtx = new AudioContext();
                audioContextRef.current = audioCtx;
                console.log("🎧 New AudioContext created, state:", audioCtx.state);
            } else {
                console.log("🎧 Using existing AudioContext, state:", audioCtx.state);
            }

            // Resume if suspended
            if (audioCtx.state === 'suspended') {
                console.log("🎧 AudioContext is suspended, attempting to resume...");
                audioCtx.resume().then(() => {
                    console.log("🎧 AudioContext resumed successfully, state:", audioCtx.state);
                    setupEventSource(url, audioCtx);
                }).catch(err => {
                    console.error("❌ Error resuming AudioContext:", err);
                    // Fallback: try to setup anyway, but it might be silent
                    setupEventSource(url, audioCtx);
                });
            } else {
                setupEventSource(url, audioCtx);
            }
        } catch (e) {
            console.error("❌ Error in playStreamAudio:", e);
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

        // CRITICAL: Resume AudioContext on direct user action (click/enter)
        // This satisfies the browser's autoplay policy gesture requirement.
        let audioCtx = audioContextRef.current;
        if (audioCtx && audioCtx.state === "suspended") {
            try {
                await audioCtx.resume();
                console.log("✅ AudioContext resumed on user gesture, current state:", audioCtx.state);
            } catch (e) {
                console.warn("⚠️ Failed to resume AudioContext on gesture:", e);
            }
        } else if (!audioCtx) {
            // Pre-emptively create it on the first gesture if it doesn't exist
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) {
                    audioCtx = new AudioContext();
                    audioContextRef.current = audioCtx;
                    console.log("🎧 AudioContext pre-emptively created on gesture, state:", audioCtx.state);
                }
            } catch (e) {
                console.warn("⚠️ Failed to create AudioContext on gesture:", e);
            }
        }

        stopAudio();

        const userMsg = { role: "user", content: text, id: Date.now().toString() };
        setMessages((prev) => [...prev, userMsg]);
        setInputValue("");
        setIsLoading(true);
        setError(null);

        try {
            const response = await sendChatMessage({
                message: text,
                history: history,
                language_code: selectedLanguage,
                map_type: "inventory",
                project_id: PROJECT_ID,
                floor_selector_url: baseURL,
                current_slug: pathname,
                user_id: localStorage.getItem("chat_user_id") || "guest",
                session_id:
                    localStorage.getItem("chat_session_id") || `session_${Date.now()}`,
            });

            console.log("🤖 Chat API Response:", response);
            console.log("📊 Response Status:", response.status);
            console.log("📦 Response Data:", response.data);

            if (response.status !== 200) {
                // axios throws on 4xx/5xx usually, but if we handle it:
                const errorData = response.data || {};
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

            const data = response.data;
            console.log("✅ Parsed Data:", {
                response: data.response,
                navigation_target: data.navigation_target,
                external_url: data.external_url,
                highlighted_units: data.highlighted_units,
                audio_content: data.audio_content ? "present" : "none",
                audio_stream_url: data.audio_stream_url || "none"
            });

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
                const normalizedTarget = normalizeNavigationTarget(data.navigation_target, PROJECT_ID);
                console.log("🧭 Navigating to normalized target:", normalizedTarget);
                navigate(normalizedTarget);
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

    const startVoiceInput = async () => {
        // CRITICAL: Resume AudioContext on direct user action (click)
        let audioCtx = audioContextRef.current;
        if (audioCtx && audioCtx.state === "suspended") {
            try {
                await audioCtx.resume();
                console.log("✅ AudioContext resumed on voice gesture, state:", audioCtx.state);
            } catch (e) {
                console.warn("⚠️ Failed to resume AudioContext on voice gesture:", e);
            }
        } else if (!audioCtx) {
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) {
                    audioCtx = new AudioContext();
                    audioContextRef.current = audioCtx;
                }
            } catch (e) {
                console.warn("⚠️ Failed to create AudioContext on voice gesture:", e);
            }
        }

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
            window.alert("Voice input is not supported in this browser.");
        }
    };

    const clearChatHistory = () => {
        if (window.confirm("Clear chat history?")) {
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
                    onClick={async () => {
                        try {
                            const AudioContext = window.AudioContext || window.webkitAudioContext;
                            const ctx = new AudioContext();
                            await ctx.resume();
                            const oscillator = ctx.createOscillator();
                            oscillator.type = 'sine';
                            oscillator.frequency.setValueAtTime(440, ctx.currentTime);
                            oscillator.connect(ctx.destination);
                            oscillator.start();
                            oscillator.stop(ctx.currentTime + 0.2);
                            console.log("🔊 Test beep successful");
                        } catch (e) {
                            console.error("❌ Test beep failed:", e);
                        }
                    }}
                    className="ml-2 text-white/60 hover:text-white"
                    title="Test Audio"
                >
                    <Send size={14} style={{ transform: 'rotate(-45deg)' }} />
                </button>
                <button
                    onClick={clearChatHistory}
                    className="ml-2 text-white/80 hover:text-white"
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
