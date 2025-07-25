import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/tree-info');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center font-poppins">
      <div className="text-center">
        {/* App Logo */}
        <div className="mb-6">
          <h1 className="text-6xl font-bold">
            <span className="text-foreground">Tr</span>
            <span className="text-primary">33</span>
          </h1>
        </div>
        
        {/* Tagline */}
        <p className="text-muted-foreground text-lg font-normal">
          Escanea, aprende, compite.
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;