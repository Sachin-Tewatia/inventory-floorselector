import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
    CHAT_MESSAGES_KEY,
    CHAT_HISTORY_KEY,
    LANGUAGE_KEY,
    detectUserLanguage,
    cleanupCorruptedLanguage
} from "../Utils/chat";
import { batchLocalStorageOperations, ResponseCache, ChatPerformanceMonitor, checkLocalStorageUsage, cleanupLocalStorage } from "../Utils/performance";

// Constants for memory management
const MAX_MESSAGES = 100;
const MAX_HISTORY_ITEMS = 50;

/**
 * Hook to manage chat messages and history persistence.
 */
export const useChatData = () => {
    const [messages, setMessages] = useState([]);
    const [history, setHistory] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState("en-US");
    
    // Performance monitoring and caching
    const cacheRef = useRef(new ResponseCache());
    const performanceMonitorRef = useRef(new ChatPerformanceMonitor());

    // Memoized message management with memory limits
    const managedMessages = useMemo(() => {
        if (messages.length > MAX_MESSAGES) {
            const trimmed = messages.slice(-MAX_MESSAGES);
            // Update state if we trimmed messages
            if (trimmed.length !== messages.length) {
                setTimeout(() => setMessages(trimmed), 0);
            }
            return trimmed;
        }
        return messages;
    }, [messages]);

    const managedHistory = useMemo(() => {
        if (history.length > MAX_HISTORY_ITEMS) {
            const trimmed = history.slice(-MAX_HISTORY_ITEMS);
            // Update state if we trimmed history
            if (trimmed.length !== history.length) {
                setTimeout(() => setHistory(trimmed), 0);
            }
            return trimmed;
        }
        return history;
    }, [history]);

    // Load initial data with localStorage cleanup
    useEffect(() => {
        try {
            // Clean up corrupted language value first
            cleanupCorruptedLanguage();
            
            // Check localStorage usage and cleanup if needed
            const { needsCleanup } = checkLocalStorageUsage();
            if (needsCleanup) {
                console.log('Cleaning up localStorage due to high usage...');
                cleanupLocalStorage();
            }

            const savedMessages = localStorage.getItem(CHAT_MESSAGES_KEY);
            const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);

            if (savedMessages) {
                const parsed = JSON.parse(savedMessages);
                // Limit messages on load to prevent quota issues
                const limitedMessages = parsed.slice(-MAX_MESSAGES);
                setMessages(limitedMessages);
            } else {
                setMessages([{
                    role: "assistant",
                    content: "Hi! How can I help you with unit availability or floor plans today?",
                    id: "welcome-msg-" + Date.now(),
                }]);
            }
            
            if (savedHistory) {
                const parsed = JSON.parse(savedHistory);
                const limitedHistory = parsed.slice(-MAX_HISTORY_ITEMS);
                setHistory(limitedHistory);
            }
            
            setSelectedLanguage(detectUserLanguage());
        } catch (e) {
            console.error("Error loading chat data:", e);
            // If there's an error, start fresh
            setMessages([{
                role: "assistant",
                content: "Hi! How can I help you with unit availability or floor plans today?",
                id: "welcome-msg-" + Date.now(),
            }]);
        }
    }, []);

    // Enhanced save with batch operations and error handling
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            // Only save essential data, avoid large objects
            const operations = [];
            
            if (managedMessages.length > 0 && managedMessages.length <= 100) {
                operations.push({ key: CHAT_MESSAGES_KEY, value: managedMessages });
            }
            
            if (managedHistory.length > 0 && managedHistory.length <= 50) {
                operations.push({ key: CHAT_HISTORY_KEY, value: managedHistory });
            }
            
            // Always save language (small data) - ensure it's a valid string
            if (selectedLanguage && typeof selectedLanguage === "string") {
                // Validate language code format before saving
                const isValidLang = /^[a-z]{2}-[A-Z]{2}$/i.test(selectedLanguage.trim());
                if (isValidLang) {
                    operations.push({ key: LANGUAGE_KEY, value: selectedLanguage.trim() });
                } else {
                    console.warn(`Invalid language code, not saving: ${selectedLanguage}`);
                }
            }
            
            if (operations.length > 0) {
                batchLocalStorageOperations(operations);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [managedMessages, managedHistory, selectedLanguage]);

    // Cache management methods
    const getCachedResponse = useCallback((message, context) => {
        const key = cacheRef.current.generateKey(message, context);
        const cached = cacheRef.current.get(key);
        if (cached) {
            performanceMonitorRef.current.recordCacheHit();
        }
        return cached;
    }, []);

    const setCachedResponse = useCallback((message, context, response) => {
        const key = cacheRef.current.generateKey(message, context);
        cacheRef.current.set(key, response);
    }, []);

    const clearCache = useCallback(() => {
        cacheRef.current.clear();
    }, []);

    const getPerformanceStats = useCallback(() => {
        return performanceMonitorRef.current.getStats();
    }, []);

    const clearChatHistory = useCallback(() => {
        if (window.confirm("Clear chat history?")) {
            setMessages([{
                role: "assistant",
                content: "History cleared.",
                id: Date.now().toString(),
            }]);
            setHistory([]);
            localStorage.removeItem(CHAT_MESSAGES_KEY);
            localStorage.removeItem(CHAT_HISTORY_KEY);
        }
    }, []);

    return {
        messages: managedMessages,
        setMessages,
        history: managedHistory,
        setHistory,
        selectedLanguage,
        setSelectedLanguage,
        clearChatHistory
    };
};
