import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Button } from "@/components/ui/button";
import { Camera, Leaf, Loader2 } from "lucide-react";


const identifyTreeFromImage = async (imageDataUrl) => {
  
  const PLANTNET_API_KEY=import.meta.env.VITE_PLANNET_API_KEY;
  const API_URL = `https://my-api.plantnet.org/v2/identify/all?api-key=${PLANTNET_API_KEY}`;
  console.log("Convirtiendo la imagen...");
  
  const formData = new FormData();
  const response= await fetch(imageDataUrl);
  const blob= await response.blob();

  formData.append('images', blob, 'tree_image.jpg');
  console.log('Enviando la imagen...');

  try {
    const apiResponse = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      throw new Error(`Error de la API: ${apiResponse.status} - ${errorText}`);
    }

    const data = await apiResponse.json();
    console.log("Respuesta recibida de Pl@ntNet:", data);
    if (data.results && data.results.length > 0) {
      const bestMatch = data.results[0];
      
      const processedResult = {
        name: bestMatch.species.commonNames[0] || bestMatch.species.scientificNameWithoutAuthor,
        scientificName: bestMatch.species.scientificNameWithoutAuthor,
        score: (bestMatch.score * 100).toFixed(2), 
        carbonScore: 0, 
        description: `Un árbol identificado con una confianza del ${(bestMatch.score * 100).toFixed(0)}%. Investiga más sobre la especie ${bestMatch.species.scientificNameWithoutAuthor}.`,
        imageUrl: imageDataUrl, 
      };
      
      return processedResult;
    } else {
      // Si la API no devuelve resultados.
      throw new Error("No se pudo identificar el árbol en la imagen.");
    }
  } catch (error) {
    console.error("Falló la llamada a la API de Pl@ntNet:", error);
    // Re-lanzamos el error para que el componente lo capture en su bloque catch.
    throw error;
  }
};

const Welcome = () => {
  const [nickname, setNickname] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  

  useEffect(() => {
    const storedNickname = localStorage.getItem('tr33-nickname');
    if (!storedNickname) {
      navigate('/nickname');
    } else {
      setNickname(storedNickname);
    }
  }, [navigate]);

  const handleScanTree = async () => {
    setIsScanning(true);
    setError(null);
    try{
      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl, // Muy importante: nos da la imagen como un string base64
        source: CameraSource.Camera, // Fuerza a que se abra la cámara y no la galería
      });

      if (image && image.dataUrl) {
        // Si tenemos la imagen, llamamos a nuestra función de "escaneo"
        const scanResult = await identifyTreeFromImage(image.dataUrl);
        navigate('/tree-info', { state: { result: scanResult } });
      }
    }catch(err){
      // Manejamos cualquier error que pueda ocurrir
      console.error("Error durante el escaneo:", err);
      setError("No se pudo escanear el árbol. Inténtalo de nuevo.");
    }finally{
      setIsScanning(false);
    }
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
              disabled={isScanning} 
              className="w-full py-6 text-base font-semibold rounded-xl tr33-shadow"
              size="lg"
            >
              {isScanning? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Escaneando...
                </>
              ):(
                <>
                <Camera className="mr-2 h-5 w-5" />
                Escanear Árbol
                </>
              )}
            </Button>
            {/* ✨ 7. Mostramos un mensaje de error si algo sale mal */}
            {error && (
              <p className="mt-4 text-sm text-destructive">{error}</p>
            )}
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