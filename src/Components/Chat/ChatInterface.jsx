"use client";

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Mic, Trash2, Send } from "lucide-react";
import "./ChatInterface.css";
import { sendChatMessage, PROJECT_ID, baseURL } from "../../APIs";
import { useChatNavigation } from "./Hooks/useChatNavigation";
import { useChatAudio } from "./Hooks/useChatAudio";
import { useChatData } from "./Hooks/useChatData";
import { useVoiceRecognition } from "./Hooks/useVoiceRecognition";
import { LANGUAGES, normalizeHistory } from "./Utils/chat";

/**
 * Main Chat Interface component.
 * Optimized and refactored to use modular hooks.
 */
const ChatInterface = () => {
  const { pathname } = useLocation();
  const { navigateToTarget } = useChatNavigation();

  // State for UI management
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Custom Hooks for modular logic
  const {
    messages,
    setMessages,
    history,
    setHistory,
    selectedLanguage,
    setSelectedLanguage,
    clearChatHistory,
  } = useChatData();

  const handleHighlightUnits = useCallback((units) => {
    if (!units?.length) return;
    window.dispatchEvent(
      new CustomEvent("CHAT_HIGHLIGHT_UNIT", { detail: { units } })
    );
  }, []);

  const {
    stopAudio,
    playFallbackAudio,
    playInlineAudio,
    playStreamAudio,
    resumeAudioContext,
  } = useChatAudio(selectedLanguage, navigateToTarget, handleHighlightUnits);

  const handleSendMessage = useCallback(
    async (textOverride = null) => {
      const text = textOverride || inputValue.trim();
      if (!text || isLoading) return;

      // Auto-resume audio context on user gesture
      await resumeAudioContext();

      // Ensure we have user interaction for audio playback
      try {
        // Create a silent audio context to enable audio permissions
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        if (audioContext.state === "suspended") {
          await audioContext.resume();
        }
        audioContext.close();
      } catch (e) {
        console.warn("Could not initialize audio context:", e);
      }

      const userMsg = {
        role: "user",
        content: text,
        id: Date.now().toString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setIsLoading(true);
      setError(null);

      const requestPayload = {
        message: text,
        history,
        language_code: selectedLanguage,
        map_type: "inventory",
        project_id: PROJECT_ID,
        floor_selector_url: baseURL,
        current_slug: pathname,
        user_id: localStorage.getItem("chat_user_id") || "guest",
        session_id:
          localStorage.getItem("chat_session_id") || `session_${Date.now()}`,
      };

      console.log("=== CHAT API REQUEST ===");
      console.log("Payload:", requestPayload);
      console.log("API URL:", `${baseURL}/chat` || "API_URL_NOT_SET");
      console.log("========================");

      try {
        const response = await sendChatMessage(requestPayload);

        if (response.status !== 200) {
          throw new Error(
            response.data?.message || `API Error: ${response.status}`
          );
        }

        const data = response.data;

        // Console log the full response for debugging
        console.log("=== CHAT API RESPONSE ===");
        console.log("Status:", response.status);
        console.log("Full Response Data:", data);
        console.log("Response Keys:", Object.keys(data));

        // Log specific response fields
        if (data.response) console.log("Text Response:", data.response);
        if (data.audio_content)
          console.log("Audio Content Length:", data.audio_content.length);
        if (data.audio_content_type)
          console.log("Audio Content Type:", data.audio_content_type);
        if (data.audio_stream_url)
          console.log("Audio Stream URL:", data.audio_stream_url);
        if (data.navigation_target)
          console.log("Navigation Target:", data.navigation_target);
        if (data.external_url) console.log("External URL:", data.external_url);
        if (data.highlighted_units)
          console.log("Highlighted Units:", data.highlighted_units);
        if (data.history) console.log("History Length:", data.history.length);
        console.log("========================");

        const assistantMsg = {
          role: "assistant",
          content: data.response || "I couldn't generate a response.",
          id: (Date.now() + 1).toString(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
        if (data.history) setHistory(normalizeHistory(data.history));
        if (data.navigation_target) {
          navigateToTarget(data.navigation_target);
        }
        if (data.external_url) window.open(data.external_url, "_blank");
        if (data.highlighted_units)
          handleHighlightUnits(data.highlighted_units);

        // Handle voice response with better error handling
        if (data.audio_content && data.audio_content_type) {
          console.log("🎵 Playing inline audio...");
          playInlineAudio(data.audio_content, data.audio_content_type);
        } else if (data.audio_stream_url) {
          console.log("🎵 Playing stream audio...");
          playStreamAudio(data.audio_stream_url, data.response);
        } else {
          console.log("🔊 No audio provided, using TTS fallback...");
          // Use TTS fallback if no audio is provided
          if (data.response) {
            playFallbackAudio(data.response);
          }
        }
      } catch (err) {
        console.error("=== CHAT API ERROR ===");
        console.error("Error Object:", err);
        console.error("Error Message:", err.message);
        console.error("Error Stack:", err.stack);
        console.error("=====================");

        const msg = err.message || "An error occurred. Please try again.";
        setError(msg);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: msg,
            id: Date.now().toString(),
            isError: true,
          },
        ]);

        // Always use TTS fallback for error messages
        console.log("🔊 Playing error message via TTS...");
        playFallbackAudio(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [
      inputValue,
      isLoading,
      resumeAudioContext,
      setMessages,
      history,
      selectedLanguage,
      pathname,
      setHistory,
      navigateToTarget,
      handleHighlightUnits,
      playInlineAudio,
      playStreamAudio,
      playFallbackAudio,
    ]
  );

  const { isListening, startVoiceInput } = useVoiceRecognition(
    selectedLanguage,
    handleSendMessage,
    stopAudio
  );

  // Handle microphone button click
  const handleMicClick = useCallback(() => {
    console.log("🎤 Microphone button clicked");
    startVoiceInput();
  }, [startVoiceInput]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const testTTS = useCallback(() => {
    console.log("🧪 Testing TTS manually...");
    const synth = window.speechSynthesis;
    if (!synth) {
      console.error("❌ SpeechSynthesis not available");
      return;
    }

    synth.cancel();
    const utterance = new SpeechSynthesisUtterance("Testing text to speech");
    utterance.onstart = () => console.log("✅ Manual TTS started");
    utterance.onend = () => console.log("✅ Manual TTS ended");
    utterance.onerror = (e) => console.error("❌ Manual TTS error:", e);

    synth.speak(utterance);
  }, []);

  // Add test button (temporary for debugging)
  useEffect(() => {
    window.testTTS = testTTS;
    console.log("🧪 TTS test function available as window.testTTS()");
  }, [testTTS]);

  // UI Render
  return (
    <div className="chat-container">
      <div className="chat-header">
        <div>
          <div className="chat-header-title">Inventory Assistant</div>
          <div className="chat-header-subtitle">
            Ask me about towers, floors, and units
          </div>
        </div>
        <select
          className="language-dropdown"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
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

      {error && <div className="chat-error-toast">{error}</div>}

      <div className="chat-input-area">
        <input
          type="text"
          className={`chat-input ${isListening ? "listening" : ""}`}
          placeholder={
            isListening ? "🎤 Listening... Speak now" : "Type your message..."
          }
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          disabled={isLoading}
        />
        <button
          className={`icon-button mic-button ${
            isListening ? "mic-listening" : ""
          }`}
          onClick={handleMicClick}
          disabled={isLoading}
          title={isListening ? "Listening..." : "Start voice input"}
        >
          {isListening ? (
            <div className="mic-listening-indicator">
              <div className="pulse-ring"></div>
              <div className="pulse-ring delay-1"></div>
              <div className="pulse-ring delay-2"></div>
              <Mic size={16} />
            </div>
          ) : (
            <Mic size={16} />
          )}
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
