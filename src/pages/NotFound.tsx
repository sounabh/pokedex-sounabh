import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-pokedex">
      <div className="bg-screen-bg screen-border rounded-2xl p-8 shadow-pokedex">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-digital font-bold text-screen-text text-glow-green">404</h1>
          <p className="mb-4 text-xl font-digital text-screen-text/70">ERROR: Route not found in database</p>
          <a href="/" className="inline-block bg-pokedex-blue hover:bg-pokedex-blue-dark text-white px-6 py-2 rounded-lg font-digital transition-colors">
            Return to Pokédex
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
