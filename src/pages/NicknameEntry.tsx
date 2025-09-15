import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { supabase } from '@/supabaseClient';

const NicknameEntry = () => {
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateNickname = async () => {
    if (!nickname.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      // ✨ 3. Insertamos el nuevo perfil en la tabla 'profiles'
      // El .select() al final hace que Supabase nos devuelva la fila que acaba de crear.
      const { data, error: insertError } = await supabase
        .from('profiles')
        .insert({ nickname: nickname.trim() })
        .select()
        .single(); // .single() para obtener un solo objeto en lugar de un array

      if (insertError) {
        // ✨ 4. Manejo de errores (ej: nickname duplicado)
        if (insertError.message.includes('duplicate key value violates unique constraint')) {
          throw new Error("Ese nickname ya está en uso. ¡Prueba con otro!");
        } else {
          throw insertError;
        }
      }

      if (data) {
        // ✨ 5. Guardamos tanto el ID como el nickname en localStorage
        localStorage.setItem('tr33-user-id', data.id);
        localStorage.setItem('tr33-nickname', data.nickname);
        navigate('/welcome');
      }

    } catch (error) {
      console.error("Error al crear el perfil:", error);
      alert(error.message || "No se pudo crear el perfil. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!nickname.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      // Buscamos un perfil que coincida con el nickname ingresado
      const { data, error: selectError } = await supabase
        .from('profiles')
        .select('id, nickname')
        .eq('nickname', nickname.trim())
        .single(); // .single() espera un único resultado y da error si no encuentra ninguno

      if (selectError) {
        // El código 'PGRST116' es específico de Supabase para "no se encontró la fila"
        if (selectError.code === 'PGRST116') {
          throw new Error("Nickname no encontrado. ¿Quieres crear uno nuevo?");
        }
        throw selectError;
      }

      if (data) {
        // Si se encuentra, guardamos los datos y continuamos
        localStorage.setItem('tr33-nickname', data.nickname);
        localStorage.setItem('tr33-user-id', data.id);
        navigate('/welcome');
      }

    } catch (err) {
      console.error("Error al ingresar:", err);
      setError(err.message || 'No se pudo encontrar el perfil.');
    } finally {
      setIsLoading(false);
    }
  }




  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateNickname
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
                {error ? (
                  <p className="text-sm text-destructive mt-2">{error}</p>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">
                    Este será tu nombre en la tabla de líderes
                  </p>
                )}
              </div>

              <Button
                onClick={handleCreateNickname}
                disabled={!nickname.trim()}
                className="w-full py-6 text-base font-semibold rounded-xl tr33-shadow"
                size="lg"
              >
                Crear Nickname
              </Button>
              <Button
                onClick={handleLogin}
                disabled={!nickname.trim() || isLoading}
                className="w-full py-6 text-base font-semibold rounded-xl"
                variant="secondary"
                size="lg"
              >
                Ingresar con Nickname Existente
              </Button>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default NicknameEntry;