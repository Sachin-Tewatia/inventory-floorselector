/**
 * Performance utilities for chat optimization
 */

// Debounce utility for input handling
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Throttle utility for scroll events
export const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Message virtualization helper
export const getVisibleMessages = (messages, containerHeight, itemHeight = 60) => {
    const visibleCount = Math.ceil(containerHeight / itemHeight) + 5; // Buffer
    const startIndex = Math.max(0, messages.length - visibleCount);
    return {
        visibleMessages: messages.slice(startIndex),
        startIndex,
        totalHeight: messages.length * itemHeight
    };
};

// Memory cleanup for audio contexts
export const cleanupAudioResources = (audioContext, eventSource) => {
    if (audioContext && audioContext.state !== 'closed') {
        audioContext.close().catch(console.error);
    }
    if (eventSource) {
        eventSource.close();
    }
};

// Optimize localStorage operations with error handling
export const batchLocalStorageOperations = (operations) => {
    const performOperations = () => {
        operations.forEach(({ key, value }) => {
            try {
                if (value === null) {
                    localStorage.removeItem(key);
                } else {
                    // Check if we're trying to store too much data
                    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
                    
                    // Skip if data is too large (more than 100KB for individual items)
                    if (stringValue.length > 100 * 1024) {
                        console.warn(`Skipping save for ${key}: data too large (${stringValue.length} chars)`);
                        
                        // For arrays, try to trim them
                        if (Array.isArray(value)) {
                            const trimmedValue = value.slice(-10); // Keep only last 10 items
                            const trimmedString = JSON.stringify(trimmedValue);
                            if (trimmedString.length <= 100 * 1024) {
                                localStorage.setItem(key, trimmedString);
                                console.log(`Saved trimmed ${key} with ${trimmedValue.length} items`);
                            }
                        }
                        return;
                    }
                    
                    localStorage.setItem(key, stringValue);
                }
            } catch (error) {
                if (error.name === 'QuotaExceededError') {
                    console.warn(`LocalStorage quota exceeded for ${key}. Attempting cleanup...`);
                    // Try to clear some space by removing old data
                    try {
                        // Remove performance data first
                        localStorage.removeItem('chat_performance_data');
                        localStorage.removeItem('chat_cache_data');
                        
                        // Clear other large items
                        for (let i = 0; i < localStorage.length; i++) {
                            const storageKey = localStorage.key(i);
                            if (storageKey && !storageKey.includes('chat_messages') && 
                                !storageKey.includes('chat_history') && 
                                !storageKey.includes('chat_language')) {
                                const item = localStorage.getItem(storageKey);
                                if (item && item.length > 50000) { // Remove items larger than 50KB
                                    localStorage.removeItem(storageKey);
                                    console.log(`Removed large item: ${storageKey}`);
                                }
                            }
                        }
                        
                        // Try again with smaller data
                        if (Array.isArray(value) && value.length > 10) {
                            const trimmedValue = value.slice(-10); // Keep only last 10 items
                            localStorage.setItem(key, JSON.stringify(trimmedValue));
                            console.log(`Saved trimmed ${key} after cleanup`);
                        } else if (typeof value === 'string' && value.length <= 1000) {
                            localStorage.setItem(key, value);
                        }
                    } catch (retryError) {
                        console.warn(`Failed to save ${key} even after cleanup:`, retryError);
                    }
                } else {
                    console.warn(`Failed to save ${key}:`, error);
                }
            }
        });
    };

    // Use requestIdleCallback if available, otherwise setTimeout
    if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(performOperations);
    } else {
        setTimeout(performOperations, 0);
    }
};

// Response caching utility
export class ResponseCache {
    constructor(maxSize = 50, ttl = 5 * 60 * 1000) { // 5 minutes TTL
        this.cache = new Map();
        this.maxSize = maxSize;
        this.ttl = ttl;
    }

    generateKey(message, context) {
        return `${message}_${JSON.stringify(context)}`.toLowerCase();
    }

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() - item.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }

        return item.data;
    }

    set(key, data) {
        // Remove oldest entries if cache is full
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    clear() {
        this.cache.clear();
    }
}

// Performance monitoring
export class ChatPerformanceMonitor {
    constructor() {
        this.metrics = {
            requestTimes: [],
            errorCount: 0,
            totalRequests: 0,
            cacheHits: 0,
            memoryUsage: []
        };
    }

    recordRequest(duration, success = true) {
        this.metrics.totalRequests++;
        this.metrics.requestTimes.push(duration);
        
        if (!success) {
            this.metrics.errorCount++;
        }

        // Keep only last 100 request times
        if (this.metrics.requestTimes.length > 100) {
            this.metrics.requestTimes.shift();
        }
    }

    recordCacheHit() {
        this.metrics.cacheHits++;
    }

    recordMemoryUsage() {
        if (performance.memory) {
            this.metrics.memoryUsage.push({
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                timestamp: Date.now()
            });

            // Keep only last 50 memory readings
            if (this.metrics.memoryUsage.length > 50) {
                this.metrics.memoryUsage.shift();
            }
        }
    }

    getStats() {
        const avgResponseTime = this.metrics.requestTimes.length > 0
            ? this.metrics.requestTimes.reduce((a, b) => a + b, 0) / this.metrics.requestTimes.length
            : 0;

        const errorRate = this.metrics.totalRequests > 0
            ? (this.metrics.errorCount / this.metrics.totalRequests) * 100
            : 0;

        const cacheHitRate = this.metrics.totalRequests > 0
            ? (this.metrics.cacheHits / this.metrics.totalRequests) * 100
            : 0;

        return {
            averageResponseTime: Math.round(avgResponseTime),
            errorRate: Math.round(errorRate * 100) / 100,
            cacheHitRate: Math.round(cacheHitRate * 100) / 100,
            totalRequests: this.metrics.totalRequests,
            memoryTrend: this.metrics.memoryUsage.slice(-10)
        };
    }
}

// Audio preloading utility
export const preloadAudio = (audioUrl) => {
    return new Promise((resolve, reject) => {
        const audio = new Audio();
        audio.preload = 'metadata';
        
        audio.addEventListener('canplaythrough', () => resolve(audio));
        audio.addEventListener('error', reject);
        
        audio.src = audioUrl;
    });
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (callback, options = {}) => {
    const defaultOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };

    return new IntersectionObserver(callback, { ...defaultOptions, ...options });
};

// Network status utility
export const createNetworkMonitor = (onStatusChange) => {
    const handleOnline = () => onStatusChange(true);
    const handleOffline = () => onStatusChange(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
};

// LocalStorage cleanup utility
export const cleanupLocalStorage = () => {
    try {
        // Get all keys and their sizes
        const keys = Object.keys(localStorage);
        const keysSizes = keys.map(key => ({
            key,
            size: localStorage.getItem(key)?.length || 0
        }));

        // Sort by size (largest first)
        keysSizes.sort((a, b) => b.size - a.size);

        // Remove large non-essential items first
        const nonEssentialKeys = keysSizes.filter(item => 
            !item.key.includes('chat_messages') && 
            !item.key.includes('chat_history') && 
            !item.key.includes('chat_language') &&
            item.size > 10000 // Remove items larger than 10KB
        );

        nonEssentialKeys.forEach(item => {
            try {
                localStorage.removeItem(item.key);
                console.log(`Removed large localStorage item: ${item.key} (${item.size} chars)`);
            } catch (e) {
                console.warn(`Failed to remove ${item.key}:`, e);
            }
        });

        return true;
    } catch (error) {
        console.error('Error cleaning localStorage:', error);
        return false;
    }
};

// Check localStorage usage
export const checkLocalStorageUsage = () => {
    try {
        let totalSize = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalSize += localStorage.getItem(key).length;
            }
        }
        
        // Estimate quota (usually 5-10MB)
        const estimatedQuota = 5 * 1024 * 1024; // 5MB
        const usagePercent = (totalSize / estimatedQuota) * 100;
        
        console.log(`LocalStorage usage: ${totalSize} chars (~${usagePercent.toFixed(1)}% of estimated quota)`);
        
        // If usage is high, suggest cleanup
        if (usagePercent > 80) {
            console.warn('LocalStorage usage is high, consider cleanup');
            return { needsCleanup: true, usage: usagePercent };
        }
        
        return { needsCleanup: false, usage: usagePercent };
    } catch (error) {
        console.error('Error checking localStorage usage:', error);
        return { needsCleanup: true, usage: 100 };
    }
};