import { useEffect, useCallback, useRef } from 'react';

/**
 * Hook for accessibility enhancements in chat interface
 */
export const useAccessibility = (isOpen, messages) => {
    const announcementRef = useRef(null);
    const focusTrapRef = useRef(null);

    // Screen reader announcements
    const announceMessage = useCallback((message) => {
        if (!announcementRef.current) return;
        
        announcementRef.current.textContent = `New message: ${message}`;
        
        // Clear after announcement
        setTimeout(() => {
            if (announcementRef.current) {
                announcementRef.current.textContent = '';
            }
        }, 1000);
    }, []);

    // Announce new assistant messages
    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === 'assistant' && !lastMessage.announced) {
                announceMessage(lastMessage.content);
                // Mark as announced to prevent re-announcement
                lastMessage.announced = true;
            }
        }
    }, [messages, announceMessage]);

    // Focus management for chat open/close
    useEffect(() => {
        if (isOpen) {
            // Focus the input when chat opens
            const input = document.querySelector('.chat-input');
            if (input) {
                setTimeout(() => input.focus(), 100);
            }
        }
    }, [isOpen]);

    // Keyboard navigation
    const handleKeyDown = useCallback((event) => {
        if (!isOpen) return;

        // Escape to close chat
        if (event.key === 'Escape') {
            const closeButton = document.querySelector('.chat-floating-button');
            if (closeButton) {
                closeButton.click();
            }
        }

        // Ctrl/Cmd + Enter to send message
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            const sendButton = document.querySelector('.send-btn');
            if (sendButton && !sendButton.disabled) {
                sendButton.click();
            }
        }
    }, [isOpen]);

    // Focus trap for modal-like behavior
    const handleFocusTrap = useCallback((event) => {
        if (!isOpen || !focusTrapRef.current) return;

        const focusableElements = focusTrapRef.current.querySelectorAll(
            'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.key === 'Tab') {
            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }, [isOpen]);

    // Set up event listeners
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keydown', handleFocusTrap);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keydown', handleFocusTrap);
        };
    }, [handleKeyDown, handleFocusTrap]);

    // Create screen reader announcement element
    useEffect(() => {
        if (!announcementRef.current) {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.className = 'sr-only';
            announcement.style.cssText = `
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            `;
            document.body.appendChild(announcement);
            announcementRef.current = announcement;
        }

        return () => {
            if (announcementRef.current) {
                document.body.removeChild(announcementRef.current);
                announcementRef.current = null;
            }
        };
    }, []);

    return {
        focusTrapRef,
        announceMessage
    };
};