import { useState, useRef, useEffect, useCallback } from "react";

/**
 * Hook to manage audio logic for the chat interface.
 * Handles streaming (SSE), fallback TTS (SpeechSynthesis), and inline audio.
 */
export const useChatAudio = (selectedLanguage, navigateToTarget, handleHighlightUnits) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContextRef = useRef(null);
    const activeAudioElementRef = useRef(null);
    const eventSourceRef = useRef(null);
    const audioQueueRef = useRef([]);
    const isPlayingQueueRef = useRef(false);
    const utteranceRef = useRef(null);

    // Chrome bug: SpeechSynthesis gets stuck if not "woken up" periodically
    useEffect(() => {
        const interval = setInterval(() => {
            if (typeof window !== "undefined" && window.speechSynthesis && window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
            }
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const stopAudio = useCallback(() => {
        console.log("🛑 stopAudio called - Stack trace:");
        console.trace();

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
        
        // Don't automatically cancel TTS - let it finish or be explicitly stopped
        // setIsPlaying(false);
    }, []);

    const playFallbackAudio = useCallback((text) => {
        if (!text) return;

        console.log("🔊 Starting TTS for:", text.substring(0, 50) + "...");

        // Don't interrupt if TTS is already playing the same or similar content
        if (isPlaying && utteranceRef.current) {
            console.log("🔊 TTS already playing, skipping");
            return;
        }

        // Stop other audio sources but NOT TTS
        if (activeAudioElementRef.current) {
            activeAudioElementRef.current.pause();
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

        try {
            const synth = window.speechSynthesis;
            if (!synth) {
                console.warn("❌ SpeechSynthesis not supported");
                return;
            }

            // Only cancel if there's actually something speaking AND it's different content
            if (synth.speaking && utteranceRef.current) {
                console.log("🛑 Canceling existing speech for new content");
                synth.cancel();
                utteranceRef.current = null;
                // Wait a bit for cancel to complete
                setTimeout(() => startNewTTS(), 100);
            } else {
                startNewTTS();
            }

            function startNewTTS() {
                // Create new utterance
                const utterance = new SpeechSynthesisUtterance(text);
                utteranceRef.current = utterance;

                // Configure voice
                const voices = synth.getVoices();
                const targetLang = selectedLanguage || 'en-US';
                let voice = voices.find(v => v.lang === targetLang && v.localService);
                if (!voice) voice = voices.find(v => v.lang === targetLang);
                if (!voice) voice = voices.find(v => v.lang.startsWith(targetLang.split('-')[0]));
                if (!voice) voice = voices.find(v => v.default);

                if (voice) {
                    utterance.voice = voice;
                    console.log("🗣️ Using voice:", voice.name, voice.lang);
                }

                utterance.lang = targetLang;
                utterance.rate = 1.0;
                utterance.pitch = 1.0;
                utterance.volume = 1.0;

                utterance.onstart = () => {
                    console.log("✅ TTS started successfully");
                    setIsPlaying(true);
                };

                utterance.onend = () => {
                    console.log("✅ TTS finished");
                    setIsPlaying(false);
                    utteranceRef.current = null;
                };

                utterance.onerror = (e) => {
                    console.error("❌ TTS error:", e.error);
                    if (e.error === 'canceled') {
                        console.log("🔊 TTS canceled");
                    }
                    setIsPlaying(false);
                    utteranceRef.current = null;
                };

                // Ensure synthesis is ready
                if (synth.paused) {
                    synth.resume();
                }

                // Start speaking
                console.log("🎤 Starting TTS...");
                synth.speak(utterance);
            }

        } catch (e) {
            console.error("❌ TTS error:", e);
            setIsPlaying(false);
            utteranceRef.current = null;
        }
    }, [selectedLanguage, isPlaying]);

    const playInlineAudio = useCallback((base64Audio, contentType) => {
        console.log("🎵 Playing inline audio");

        // Stop streaming audio but not TTS
        if (activeAudioElementRef.current) {
            activeAudioElementRef.current.pause();
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
        
        if (!base64Audio) {
            console.warn("❌ No audio data");
            return;
        }

        try {
            const audioUrl = `data:${contentType};base64,${base64Audio}`;
            const audio = new Audio(audioUrl);
            activeAudioElementRef.current = audio;

            audio.onplay = () => {
                console.log("🎵 Audio started");
                setIsPlaying(true);
            };
            audio.onended = () => {
                console.log("🎵 Audio ended");
                setIsPlaying(false);
            };
            audio.onerror = (e) => {
                console.error("❌ Audio error:", e);
                setIsPlaying(false);
            };

            audio.play().then(() => {
                console.log("✅ Audio playing");
            }).catch((e) => {
                console.error("❌ Audio play failed:", e);
                setIsPlaying(false);
            });
        } catch (e) {
            console.error("❌ Inline audio error:", e);
        }
    }, []);

    const setupEventSource = useCallback((url, audioCtx, fallbackText) => {
        try {
            const eventSource = new EventSource(url);
            eventSourceRef.current = eventSource;

            let audioMetadata = null;
            let hasReceivedAudio = false;

            // Fallback timeout
            const fallbackTimeout = setTimeout(() => {
                if (!hasReceivedAudio) {
                    console.log("🔊 No audio received, using TTS fallback");
                    eventSource.close();
                    eventSourceRef.current = null;
                    setIsPlaying(false);
                    if (fallbackText) {
                        playFallbackAudio(fallbackText);
                    }
                }
            }, 5000);

            const processQueue = () => {
                if (isPlayingQueueRef.current || audioQueueRef.current.length === 0) return;
                if (!audioContextRef.current || audioContextRef.current.state === "closed") return;

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

            const convertPCMToAudioBuffer = async (arrayBuffer, sampleRate = 24000) => {
                const int16Array = new Int16Array(arrayBuffer);
                const float32Array = new Float32Array(int16Array.length);
                for (let i = 0; i < int16Array.length; i++) {
                    float32Array[i] = int16Array[i] / 32768.0;
                }
                const buffer = audioCtx.createBuffer(1, float32Array.length, sampleRate);
                buffer.getChannelData(0).set(float32Array);
                return buffer;
            };

            eventSource.addEventListener('metadata', (event) => {
                try {
                    audioMetadata = JSON.parse(event.data);
                } catch (e) {
                    console.warn("Failed to parse metadata:", e);
                }
            });

            eventSource.addEventListener('audio_chunk', async (event) => {
                if (!event.data) return;

                hasReceivedAudio = true;
                clearTimeout(fallbackTimeout);

                try {
                    const binaryString = window.atob(event.data.trim());
                    const arrayBuffer = new Uint8Array(binaryString.length).map((_, i) => binaryString.charCodeAt(i)).buffer;
                    const sampleRate = audioMetadata?.sample_rate || 24000;
                    const audioBuffer = await convertPCMToAudioBuffer(arrayBuffer, sampleRate);
                    audioQueueRef.current.push(audioBuffer);
                    processQueue();
                } catch (e) {
                    console.error("Error processing audio chunk:", e);
                }
            });

            eventSource.addEventListener('complete', () => {
                clearTimeout(fallbackTimeout);
                eventSource.close();
                eventSourceRef.current = null;
            });

            eventSource.addEventListener('highlight_units', (event) => {
                try {
                    const data = JSON.parse(event.data);
                    handleHighlightUnits(data.units || data);
                } catch (e) {
                    console.warn("Failed to parse highlight_units:", e);
                }
            });

            eventSource.addEventListener('navigation_target', (event) => {
                try {
                    let target = event.data;
                    if (target.startsWith("{")) target = JSON.parse(target).target || target;
                    if (target) navigateToTarget(target);
                } catch (e) {
                    console.warn("Failed to parse navigation_target:", e);
                }
            });

            // Handle error events (for TTS generation failures)
            eventSource.addEventListener('error', (event) => {
                console.log("🎵 SSE error event:", event);
                try {
                    const errorData = JSON.parse(event.data);
                    console.log("🎵 Error data:", errorData);

                    const isGenerationError = errorData && (
                        errorData.type === 'model_error' ||
                        errorData.type === 'generation_failed' ||
                        errorData.message?.includes('TTS failed')
                    );

                    if (isGenerationError) {
                        console.log("🔊 TTS generation failed, using fallback");
                        clearTimeout(fallbackTimeout);
                        eventSource.close();
                        eventSourceRef.current = null;
                        setIsPlaying(false);

                        if (fallbackText) {
                            setTimeout(() => playFallbackAudio(fallbackText), 100);
                        }
                        return;
                    }
                } catch (e) {
                    console.log("🎵 Could not parse error data:", e);
                }
            });

            eventSource.onerror = (err) => {
                console.log("🎵 SSE connection error:", err);

                if (eventSource.readyState === EventSource.CLOSED) {
                    console.log("🎵 EventSource closed");
                    clearTimeout(fallbackTimeout);
                    if (audioQueueRef.current.length === 0 && !isPlayingQueueRef.current) {
                        console.log("🔊 No audio received, using TTS fallback");
                        setIsPlaying(false);
                        if (fallbackText) {
                            setTimeout(() => playFallbackAudio(fallbackText), 100);
                        }
                    }
                }
            };
        } catch (e) {
            console.error("❌ EventSource setup error:", e);
            setIsPlaying(false);
        }
    }, [handleHighlightUnits, navigateToTarget, playFallbackAudio]);

    const playStreamAudio = useCallback((url, text) => {
        console.log("🎵 Starting stream audio:", url);

        // Stop other audio but not TTS
        if (activeAudioElementRef.current) {
            activeAudioElementRef.current.pause();
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
        
        if (!url) {
            console.warn("❌ No stream URL");
            return;
        }

        setIsPlaying(true);

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) {
            console.error("❌ AudioContext not supported");
            setIsPlaying(false);
            return;
        }

        let audioCtx = audioContextRef.current;
        if (!audioCtx || audioCtx.state === "closed") {
            console.log("🎵 Creating AudioContext");
            audioCtx = new AudioContext();
            audioContextRef.current = audioCtx;
        }

        console.log("🎵 AudioContext state:", audioCtx.state);
        if (audioCtx.state === 'suspended') {
            console.log("🎵 Resuming AudioContext");
            audioCtx.resume().finally(() => setupEventSource(url, audioCtx, text));
        } else {
            setupEventSource(url, audioCtx, text);
        }
    }, [setupEventSource]);

    // Ensure AudioContext is ready for browser autoplay policies
    const resumeAudioContext = useCallback(async () => {
        if (audioContextRef.current && audioContextRef.current.state === "suspended") {
            await audioContextRef.current.resume();
        } else if (!audioContextRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) audioContextRef.current = new AudioContext();
        }
    }, []);

    return {
        isPlaying,
        setIsPlaying,
        stopAudio,
        playFallbackAudio,
        playInlineAudio,
        playStreamAudio,
        resumeAudioContext,
        audioContextRef,
        utteranceRef
    };
};