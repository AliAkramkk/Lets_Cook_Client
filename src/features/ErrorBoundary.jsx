import React from "react";

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error, errorInfo) => {
      // You can log the error to an error reporting service here
      console.error("Error caught by error boundary:", error, errorInfo);
      setHasError(true);
    };

    // Attach the error handler
    window.addEventListener("error", errorHandler);

    return () => {
      // Detach the error handler on component unmount
      window.removeEventListener("error", errorHandler);
    };
  }, []);

  if (hasError) {
    // You can render a fallback UI here
    return <div>Something went wrong.</div>;
  }

  return <>{children}</>;
};

export default ErrorBoundary;
