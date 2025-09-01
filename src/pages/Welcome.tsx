import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Leaf } from "lucide-react";

const Welcome = () => {
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedNickname = localStorage.getItem('tr33-nickname');
    if (!storedNickname) {
      navigate('/nickname');
    } else {
      setNickname(storedNickname);
    }
  }, [navigate]);

  const handleScanTree = () => {
    navigate('/tree-info');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center font-poppins p-4">
      <div className="w-full max-w-md">
        
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-foreground">Tr</span>
            <span className="text-primary">33</span>
          </h1>
        </div>

        {/* Welcome Card */}
        <Card className="shadow-lg mb-8">
          <CardContent className="p-6 text-center">
            
            {/* Welcome Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary/10 rounded-full">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
            </div>

            {/* Welcome Message */}
            <div className="space-y-4 mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                ¡Bienvenido {nickname}!
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                Estás listo para comenzar tu aventura ecológica. 
                Escanea árboles, aprende sobre la naturaleza y 
                contribuye al cuidado del medio ambiente.
              </p>
            </div>

            {/* Scan Button */}
            <Button 
              onClick={handleScanTree}
              className="w-full py-6 text-base font-semibold rounded-xl tr33-shadow"
              size="lg"
            >
              <Camera className="mr-2 h-5 w-5" />
              Escanear Árbol
            </Button>

          </CardContent>
        </Card>

        {/* Bottom Tip */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            💡 Apunta tu cámara a cualquier árbol para comenzar
          </p>
        </div>

      </div>
    </div>
  );
};

export default Welcome;