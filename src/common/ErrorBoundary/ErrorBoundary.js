import React from "react";

class ErrorBoundary extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        // Display fallback UI
        this.setState({ hasError: true });
        // You can also log the error to an error reporting service
        warn(error, info);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h5>Oops! Look at console.</h5>;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
