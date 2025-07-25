import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Leaf, TreePine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import treeImage from "@/assets/oak-tree.jpg";

const TreeInfo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background font-poppins">
      <div className="max-w-md mx-auto p-4">
        
        {/* Tree Image */}
        <div className="mb-6">
          <img 
            src={treeImage}
            alt="Roble Común"
            className="w-full h-64 object-cover rounded-xl shadow-md"
          />
        </div>

        {/* Tree Information Card */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-6">
            
            {/* Tree Name and Species */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Roble Común
              </h1>
              <p className="text-base text-muted-foreground italic">
                Quercus robur
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
                  22 kg de CO₂/año
                </span>
              </div>
            </div>

            {/* Family Section */}
            <div className="flex items-center">
              <TreePine className="h-5 w-5 text-primary mr-3" />
              <span className="text-base text-foreground">
                Familia: Fagaceae
              </span>
            </div>

          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            className="w-full py-6 text-base font-semibold rounded-xl tr33-shadow"
            size="lg"
          >
            Guardar en mi Colección
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