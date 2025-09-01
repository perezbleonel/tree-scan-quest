import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

const NicknameEntry = () => {
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  const handleContinue = () => {
    if (nickname.trim()) {
      localStorage.setItem('tr33-nickname', nickname.trim());
      navigate('/welcome');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleContinue();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center font-poppins p-4">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-foreground">Tr</span>
            <span className="text-primary">33</span>
          </h1>
          <p className="text-muted-foreground">
            ¡Bienvenido! Ingresa tu nickname
          </p>
        </div>

        {/* Nickname Input Card */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary/10 rounded-full">
                <User className="h-8 w-8 text-primary" />
              </div>
            </div>

            {/* Input Section */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="nickname" className="text-base font-medium">
                  Tu Nickname
                </Label>
                <Input
                  id="nickname"
                  type="text"
                  placeholder="Ej: EcoWarrior2024"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="mt-2 text-base py-6 rounded-xl"
                  maxLength={20}
                  autoFocus
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Este será tu nombre en la tabla de líderes
                </p>
              </div>

              <Button 
                onClick={handleContinue}
                disabled={!nickname.trim()}
                className="w-full py-6 text-base font-semibold rounded-xl tr33-shadow"
                size="lg"
              >
                Continuar
              </Button>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default NicknameEntry;