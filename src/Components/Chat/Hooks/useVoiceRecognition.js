import { useState, useCallback, useRef } from "react";

/**
 * Hook to manage browser speech recognition.
 * Simple mode - listens for one message then stops.
 */
export const useVoiceRecognition = (selectedLanguage, onResult, stopAudio) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const retryCountRef = useRef(0);
  const maxRetries = 2;

  // Helper function to sanitize language code
  const sanitizeLanguage = useCallback((lang) => {
    if (!lang || typeof lang !== "string") return "en-US";
    
    // Remove any surrounding quotes or whitespace
    const cleaned = lang.trim().replace(/^["']+|["']+$/g, '');
    
    // Validate it matches language code pattern (e.g., "en-US", "hi-IN")
    if (/^[a-z]{2}-[A-Z]{2}$/i.test(cleaned)) {
      return cleaned;
    }
    
    // Try to extract language code from corrupted string
    const match = cleaned.match(/([a-z]{2}-[A-Z]{2})/i);
    if (match) {
      return match[1];
    }
    
    console.warn(`Invalid language code: ${lang}, using en-US`);
    return "en-US";
  }, []);

  // Helper function to create and configure a recognition instance
  const createRecognition = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    // Configure recognition with sanitized language
    const sanitizedLang = sanitizeLanguage(selectedLanguage);
    recognition.lang = sanitizedLang;
    console.log(`🎤 Using language: ${sanitizedLang} (original: ${selectedLanguage})`);
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("🎤 Voice recognition started successfully");
      setIsListening(true);
      retryCountRef.current = 0;
    };

    recognition.onend = () => {
      console.log("🎤 Voice recognition ended");
      setIsListening(false);
      if (recognitionRef.current === recognition) {
        recognitionRef.current = null;
      }
    };

    recognition.onerror = (e) => {
      console.error("🎤 Speech recognition error:", e.error, e);
      setIsListening(false);
      if (recognitionRef.current === recognition) {
        recognitionRef.current = null;
      }

      // Handle specific errors
      if (e.error === "not-allowed") {
        retryCountRef.current = 0;
        alert(
          "Microphone access denied. Please allow microphone access in your browser settings and try again."
        );
      } else if (e.error === "no-speech") {
        retryCountRef.current = 0;
        console.log("🎤 No speech detected, please try again.");
      } else if (e.error === "network") {
        // Network errors - don't retry automatically, just log
        // Network errors are often transient and the user can try again
        retryCountRef.current = 0;
        console.warn("🎤 Network error occurred. User can try again.");
      } else if (e.error === "service-not-allowed") {
        retryCountRef.current = 0;
        alert(
          "Speech recognition service is not available. Please try again later."
        );
      } else if (e.error === "language-not-supported") {
        retryCountRef.current = 0;
        alert("Selected language is not supported for speech recognition.");
      } else if (e.error === "aborted") {
        retryCountRef.current = 0;
        console.log("🎤 Recognition aborted (this is normal)");
      } else {
        retryCountRef.current = 0;
        console.warn(
          `🎤 Speech recognition error: ${e.error}. User can try again.`
        );
      }
    };

    recognition.onresult = (event) => {
      console.log("🎤 Voice recognition result received:", event);

      if (event.results && event.results.length > 0) {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;

        console.log("🎤 Transcript:", transcript, "Confidence:", confidence);

        if (transcript && transcript.trim()) {
          console.log("🎤 Calling onResult with:", transcript.trim());
          onResult(transcript.trim());
        } else {
          console.log("🎤 Empty transcript received");
        }
      } else {
        console.log("🎤 No results in event");
      }
    };

    return recognition;
  }, [selectedLanguage, onResult, sanitizeLanguage]);

  const startVoiceInput = useCallback(() => {
    console.log("🎤 startVoiceInput called");

    // Stop any existing audio
    stopAudio();

    // Check if speech recognition is supported
    if (typeof window === "undefined") {
      console.error("🎤 Window is undefined");
      return;
    }

    const hasWebkitSpeech = "webkitSpeechRecognition" in window;
    const hasSpeech = "SpeechRecognition" in window;

    if (!hasWebkitSpeech && !hasSpeech) {
      alert(
        "Voice input is not supported in this browser. Please use Chrome, Edge, or Safari."
      );
      return;
    }

    // Stop any existing recognition instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      } catch (e) {
        // Ignore errors when stopping
      }
      recognitionRef.current = null;
    }

    const recognition = createRecognition();

    try {
      console.log("🎤 Attempting to start recognition...");
      recognition.start();
      console.log("🎤 Recognition.start() called successfully");
    } catch (error) {
      console.error("🎤 Failed to start voice recognition:", error);
      setIsListening(false);
      recognitionRef.current = null;

      if (error.name === "InvalidStateError") {
        console.warn("🎤 Recognition already started or not ready");
        const retryRecognition = createRecognition();
        try {
          retryRecognition.start();
          console.log("🎤 Retry: Recognition.start() called");
        } catch (retryError) {
          console.error("🎤 Retry also failed:", retryError);
          alert(
            "Failed to start microphone. Please check your browser permissions and try again."
          );
        }
      } else {
        alert(
          "Failed to start microphone. Please check your browser permissions and try again."
        );
      }
    }
  }, [stopAudio, createRecognition]);

  const stopVoiceInput = useCallback(() => {
    if (recognitionRef.current) {
      console.log("🎤 Manually stopping voice recognition");
      recognitionRef.current.stop();
    }
  }, []);

  return {
    isListening,
    startVoiceInput,
    stopVoiceInput,
  };
};
