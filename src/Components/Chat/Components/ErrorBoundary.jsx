import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ChatErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        
        // Log error to monitoring service
        console.error('Chat Error Boundary caught an error:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="chat-error-boundary">
                    <div className="error-content">
                        <AlertTriangle size={48} className="error-icon" />
                        <h3>Something went wrong with the chat</h3>
                        <p>We're sorry for the inconvenience. Please try refreshing the chat.</p>
                        <button 
                            onClick={this.handleRetry}
                            className="retry-button"
                        >
                            <RefreshCw size={16} />
                            Retry Chat
                        </button>
                        {process.env.NODE_ENV === 'development' && (
                            <details className="error-details">
                                <summary>Error Details (Development)</summary>
                                <pre>{this.state.error && this.state.error.toString()}</pre>
                                <pre>{this.state.errorInfo.componentStack}</pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ChatErrorBoundary;