import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Leaf, Loader2, TreePine, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import treeImage from "@/assets/oak-tree.jpg";
import { useEffect, useState } from "react";
import { supabase } from '@/supabaseClient';
import { toast, Toaster } from "sonner";

const TreeInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isFactLoading, setIsFactLoading] = useState(true);
  const [funFact, setFunFact] = useState('');
  const { result } = location.state || {};
  useEffect(() => {
    if (!result) {
      console.log("No se encontraron datos del árbol, redirigiendo a la página principal.");
      navigate('/');
    } else {
      // ✨ Cuando tenemos el resultado, buscamos el dato curioso
      const fetchFunFact = async () => {
        setIsFactLoading(true);
        try {
          // Llamamos a nuestra Supabase Edge Function
          const { data, error } = await supabase.functions.invoke('fun-fact', {
            body: { treeName: result.scientificName }, // Enviamos el nombre científico
          });

          if (error) throw error;

          if (data.funFact) {
            setFunFact(data.funFact);
          }
        } catch (error) {
          console.error("Error al obtener el dato curioso:", error);
          setFunFact("No se pudo cargar un dato interesante en este momento.");
        } finally {
          setIsFactLoading(false);
        }
      };

      fetchFunFact();
    }
  }, [result, navigate]);

  const handleSaveToCollection = async () => {
    setIsLoading(true);
    const userId = localStorage.getItem('tr33-user-id');

    if (!userId) {
      toast.error("Error de autenticación", {
        description: "No se encontró tu ID de usuario. Por favor, reinicia la app.",
      });
      setIsLoading(false);
      return;
    }

    // ✨ 4. Calculamos los puntos basados en la confianza del escaneo de Pl@ntNet
    const carbonPoints = Math.round(result.score * 100);

    try {
      // ✨ 5. Insertamos el árbol escaneado en la base de datos
      const { data, error } = await supabase
        .from('scanned_trees')
        .insert({
          user_id: userId,
          tree_name: result.name,
          scientific_name: result.scientificName,
          carbon_score: carbonPoints // Usamos los puntos calculados
        });

      if (error) throw error;

      // ✨ 6. Si todo sale bien, mostramos notificación y redirigimos
      toast.success("¡Árbol guardado!", {
        description: `Has ganado ${carbonPoints} puntos. ¡Sigue explorando!`,
      });

      // Esperamos un poco para que el usuario vea la notificación
      setTimeout(() => {
        navigate('/welcome');
      }, 1500);

    } catch (error) {
      console.error("Error al guardar el árbol:", error);
      toast.error("Error al guardar", {
        description: "No se pudo guardar el árbol en tu colección. Inténtalo de nuevo.",
      });
      setIsLoading(false);
    }

  }
  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-poppins">
        <p>Cargando información del árbol...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-poppins">
      <div className="max-w-md mx-auto p-4">

        {/* Tree Image */}
        <div className="mb-6">
          <img
            src={result.imageUrl}
            alt={result.name}
            className="w-full h-64 object-cover rounded-xl shadow-md"
          />
        </div>

        {/* Tree Information Card */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-6">

            {/* Tree Name and Species */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {result.name}
              </h1>
              <p className="text-base text-muted-foreground italic">
                {result.scientificName}
              </p>
            </div>

            <Separator className="my-4" />

            {/* Carbon Capture Section */}
            <div className="flex items-center mb-4">
              <Leaf className="h-5 w-5 text-primary mr-3" />
              <div>
                <span className="text-base text-foreground">
                  Captura de Carbono:
                </span>
                <span className="font-semibold text-foreground ml-1">
                  {result.score}%
                </span>
              </div>
            </div>

            {/* Family Section */}
            <div className="flex items-center">
              <TreePine className="h-5 w-5 text-primary mr-3" />
              <span className="text-base text-foreground">
                {result.description}
              </span>
            </div>
            <Separator className="my-4" />

            {/* ✨ Nueva sección para el Dato Curioso */}
            <div className="flex items-start">
              <Sparkles className="h-5 w-5 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
              <div>
                <span className="text-base font-semibold text-foreground">Dato Curioso:</span>
                {isFactLoading ? (
                  <p className="text-sm text-muted-foreground italic mt-1">Buscando un dato interesante...</p>
                ) : (
                  <p className="text-base text-muted-foreground mt-1">{funFact}</p>
                )}
              </div>
            </div>


          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleSaveToCollection}
            disabled={isLoading}
            className="w-full py-6 text-base font-semibold rounded-xl tr33-shadow"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar en mi Colección"
            )}

          </Button>

          <Button
            variant="outline"
            className="w-full py-6 text-base font-semibold rounded-xl"
            onClick={() => navigate('/leaderboard')}
          >
            Ver Tabla de Líderes
          </Button>
        </div>
      </div>
    </div>

  );

};

export default TreeInfo;