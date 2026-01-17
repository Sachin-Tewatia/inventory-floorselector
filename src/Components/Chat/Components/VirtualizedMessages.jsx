import React, { useMemo, useRef, useEffect, useState } from 'react';
import { throttle } from '../Utils/performance';

const MESSAGE_HEIGHT = 60; // Approximate height per message
const BUFFER_SIZE = 5; // Extra messages to render outside viewport

const VirtualizedMessages = ({ messages, isLoading, messagesEndRef }) => {
    const containerRef = useRef(null);
    const [containerHeight, setContainerHeight] = useState(400);
    const [scrollTop, setScrollTop] = useState(0);

    // Calculate visible range
    const visibleRange = useMemo(() => {
        const startIndex = Math.max(0, Math.floor(scrollTop / MESSAGE_HEIGHT) - BUFFER_SIZE);
        const endIndex = Math.min(
            messages.length,
            Math.ceil((scrollTop + containerHeight) / MESSAGE_HEIGHT) + BUFFER_SIZE
        );
        return { startIndex, endIndex };
    }, [scrollTop, containerHeight, messages.length]);

    // Get visible messages
    const visibleMessages = useMemo(() => {
        return messages.slice(visibleRange.startIndex, visibleRange.endIndex);
    }, [messages, visibleRange]);

    // Throttled scroll handler
    const handleScroll = useMemo(
        () => throttle((e) => {
            setScrollTop(e.target.scrollTop);
        }, 16), // ~60fps
        []
    );

    // Update container height on resize
    useEffect(() => {
        const updateHeight = () => {
            if (containerRef.current) {
                setContainerHeight(containerRef.current.clientHeight);
            }
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    // Auto-scroll to bottom for new messages
    useEffect(() => {
        if (containerRef.current && messagesEndRef?.current) {
            const container = containerRef.current;
            const isNearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 100;
            
            if (isNearBottom) {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [messages.length, messagesEndRef]);

    const totalHeight = messages.length * MESSAGE_HEIGHT;
    const offsetY = visibleRange.startIndex * MESSAGE_HEIGHT;

    return (
        <div 
            ref={containerRef}
            className="chat-messages virtualized"
            onScroll={handleScroll}
            style={{ height: '100%', overflowY: 'auto' }}
        >
            <div style={{ height: totalHeight, position: 'relative' }}>
                <div style={{ transform: `translateY(${offsetY}px)` }}>
                    {visibleMessages.map((msg, index) => {
                        const actualIndex = visibleRange.startIndex + index;
                        return (
                            <MessageItem 
                                key={msg.id} 
                                message={msg} 
                                index={actualIndex}
                            />
                        );
                    })}
                </div>
            </div>
            
            {isLoading && (
                <div className="message-wrapper assistant">
                    <div className="message loading">
                        <TypingIndicator />
                    </div>
                </div>
            )}
            
            <div ref={messagesEndRef} />
        </div>
    );
};

const MessageItem = React.memo(({ message, index }) => {
    return (
        <div 
            className={`message-wrapper ${message.role}`}
            style={{ 
                minHeight: MESSAGE_HEIGHT,
                display: 'flex',
                alignItems: 'flex-start',
                padding: '8px 0'
            }}
        >
            <div className={`message ${message.isError ? 'error' : ''}`}>
                {message.content}
                {message.canRetry && (
                    <button 
                        className="retry-message-btn"
                        onClick={() => window.dispatchEvent(new CustomEvent('retryMessage', { detail: message }))}
                    >
                        Retry
                    </button>
                )}
            </div>
        </div>
    );
});

const TypingIndicator = () => (
    <div className="dot-typing">
        <div></div>
        <div></div>
        <div></div>
    </div>
);

export default VirtualizedMessages;