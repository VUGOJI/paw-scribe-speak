import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-soft">
      <div className="text-center space-y-6 p-8">
        <div className="text-8xl font-bold text-primary opacity-50">404</div>
        <h1 className="text-2xl font-bold text-foreground">Page Not Found</h1>
        <p className="text-muted-foreground">
          Looks like your pet led you to the wrong place!
        </p>
        <a 
          href="/" 
          className="inline-block bg-gradient-primary text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
