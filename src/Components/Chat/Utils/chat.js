// Constants for storage
export const CHAT_HISTORY_KEY = "convrse_inventory_chat_history";
export const CHAT_MESSAGES_KEY = "convrse_inventory_chat_messages";
export const CHAT_OPEN_STATE_KEY = "convrse_inventory_chat_open_state";
export const LANGUAGE_KEY = "convrse_inventory_chat_language";

// Supported languages
export const LANGUAGES = [
    { code: "en-US", name: "English", script: "English" },
    { code: "te-IN", name: "Telugu", script: "తెలుగు" },
    { code: "ta-IN", name: "Tamil", script: "தமிழ்" },
    { code: "ml-IN", name: "Malayalam", script: "മലയാളம்" },
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

const sanitizeStoredLanguage = (value) => {
    if (!value) return null;
    
    // If it's already a valid language code, return it
    if (typeof value === "string" && /^[a-z]{2}-[A-Z]{2}$/.test(value.trim())) {
        return value.trim();
    }

    // Try to parse JSON recursively to handle nested escaping
    let currentValue = value;
    let maxAttempts = 10; // Prevent infinite loops
    let attempts = 0;
    
    while (attempts < maxAttempts) {
        attempts++;
        
        // Check if it's already a valid language code
        if (typeof currentValue === "string") {
            const trimmed = currentValue.trim();
            // Remove surrounding quotes if present
            const unquoted = trimmed.replace(/^["']|["']$/g, '');
            if (/^[a-z]{2}-[A-Z]{2}$/.test(unquoted)) {
                return unquoted;
            }
        }
        
        // Try to parse as JSON
        if (typeof currentValue === "string") {
            try {
                const parsed = JSON.parse(currentValue);
                if (typeof parsed === "string") {
                    currentValue = parsed;
                    continue;
                } else {
                    break;
                }
            } catch (error) {
                // Not valid JSON, try to extract language code from string
                const match = currentValue.match(/([a-z]{2}-[A-Z]{2})/i);
                if (match) {
                    return match[1];
                }
                break;
            }
        } else {
            break;
        }
    }
    
    // Fallback: try to extract any language code pattern
    if (typeof currentValue === "string") {
        const match = currentValue.match(/([a-z]{2}-[A-Z]{2})/i);
        if (match) {
            return match[1];
        }
    }
    
    return null;
};

export const detectUserLanguage = () => {
    try {
        const savedRaw = localStorage.getItem(LANGUAGE_KEY);
        if (savedRaw) {
            const saved = sanitizeStoredLanguage(savedRaw);
            if (saved) {
                // Validate it's a supported language
                const isValid = LANGUAGES.some(lang => lang.code === saved);
                if (isValid) {
                    return saved;
                } else {
                    // Clean up invalid language
                    console.warn(`Invalid language code in storage: ${savedRaw}, cleaning up`);
                    localStorage.removeItem(LANGUAGE_KEY);
                }
            } else {
                // Clean up corrupted language
                console.warn(`Corrupted language value in storage: ${savedRaw}, cleaning up`);
                localStorage.removeItem(LANGUAGE_KEY);
            }
        }

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

export const normalizeHistory = (history) => {
    if (!history) return [];
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

// Clean up corrupted language value from localStorage
export const cleanupCorruptedLanguage = () => {
    try {
        const saved = localStorage.getItem(LANGUAGE_KEY);
        if (saved) {
            const sanitized = sanitizeStoredLanguage(saved);
            if (!sanitized || !LANGUAGES.some(lang => lang.code === sanitized)) {
                console.warn("Cleaning up corrupted language value from localStorage");
                localStorage.removeItem(LANGUAGE_KEY);
                return true;
            }
        }
        return false;
    } catch (error) {
        console.warn("Error cleaning up language:", error);
        try {
            localStorage.removeItem(LANGUAGE_KEY);
        } catch (e) {
            // Ignore
        }
        return true;
    }
};
