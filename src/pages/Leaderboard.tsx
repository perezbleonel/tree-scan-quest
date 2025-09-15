import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { useEffect, useState } from "react";

interface Player {
  position: number;
  name: string;
  points: number;
  isCurrentUser?: boolean;
}

/* const mockPlayers: Player[] = [
  { position: 1, name: "María González", points: 3250 },
  { position: 2, name: "Carlos Rodríguez", points: 2890 },
  { position: 3, name: "Ana García", points: 2100 },
  { position: 4, name: "Juan Pérez", points: 1250, isCurrentUser: true },
  { position: 5, name: "Luis Martín", points: 1180 },
  { position: 6, name: "Carmen López", points: 980 },
  { position: 7, name: "David Sánchez", points: 850 },
  { position: 8, name: "Elena Ruiz", points: 720 },
];
 */
const getMedalIcon = (position: number) => {
  switch (position) {
    case 1:
      return "🥇";
    case 2:
      return "🥈";
    case 3:
      return "🥉";
    default:
      return `#${position}`;
  }
};

const Leaderboard = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUserNickname = localStorage.getItem('tr33-nickname');

    useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase.rpc('get_leaderboard');
      
      if (error) {
        console.error("Error al cargar la tabla de líderes:", error);
        setPlayers([]);
      } else if (data) {
        const formattedPlayers = data.map((player, index) => ({
          position: index + 1,
          name: player.nickname,
          points: player.total_points,
          isCurrentUser: player.nickname === currentUserNickname,
        }));
        setPlayers(formattedPlayers);
      }
      setIsLoading(false);
    };

    fetchLeaderboard();
  }, [currentUserNickname]); 

  const currentUser = players.find(player => player.isCurrentUser);

    if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background font-poppins">
      
      {/* Header */}
      <div className="bg-background border-b border-border px-4 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/tree-info')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">
            Tabla de Líderes
          </h1>
          <div className="w-9" /> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        
        {/* Current User Position */}
        {currentUser && (
          <Card className="mb-6 bg-secondary border-primary shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Trophy className="h-6 w-6 text-primary mr-3" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Tu Puesto: #{currentUser.position}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {currentUser.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">
                    {currentUser.points.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Puntos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leaderboard List */}
        <Card className="shadow-lg">
          <CardContent className="p-0">
            {players.map((player, index) => (
              <div
                key={player.position}
                className={`
                  flex items-center justify-between p-4 
                  ${index !== players.length - 1 ? 'border-b border-border' : ''}
                  ${player.isCurrentUser ? 'bg-secondary/50' : 'bg-background'}
                `}
              >
                
                {/* Position and Name */}
                <div className="flex items-center">
                  <div className="w-10 h-10 flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-foreground">
                      {getMedalIcon(player.position)}
                    </span>
                  </div>
                  <div>
                    <p className={`
                      text-base font-semibold 
                      ${player.isCurrentUser ? 'text-primary' : 'text-foreground'}
                    `}>
                      {player.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Puesto #{player.position}
                    </p>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <p className={`
                    text-lg font-bold 
                    ${player.isCurrentUser ? 'text-primary' : 'text-foreground'}
                  `}>
                    {player.points.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Pts</p>
                </div>

              </div>
            ))}
          </CardContent>
        </Card>

        {/* Back to Tree Info */}
        <div className="mt-6">
          <Button 
            variant="outline"
            className="w-full py-6 text-base font-semibold rounded-xl"
            onClick={() => navigate('/welcome')}
          >
            Volver a Información del Árbol
          </Button>
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;