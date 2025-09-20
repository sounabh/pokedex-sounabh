import { Progress } from "@/components/ui/progress";
import { Pokemon } from "@/types/pokemon";
import { pokemonApi } from "@/utils/pokemonApi";

interface PokemonStatsProps {
  pokemon: Pokemon;
}

export const PokemonStats = ({ pokemon }: PokemonStatsProps) => {
  const getStatMax = (statName: string): number => {
    const maxStats: Record<string, number> = {
      "hp": 255,
      "attack": 190,
      "defense": 230,
      "special-attack": 194,
      "special-defense": 230,
      "speed": 180,
    };
    return maxStats[statName] || 200;
  };

  const getStatColor = (statName: string, percentage: number): string => {
    const colors: Record<string, string> = {
      "hp": "hsl(0, 100%, 60%)", // Red
      "attack": "hsl(25, 100%, 60%)", // Orange
      "defense": "hsl(225, 100%, 60%)", // Blue
      "special-attack": "hsl(260, 100%, 60%)", // Purple
      "special-defense": "hsl(300, 100%, 60%)", // Magenta  
      "speed": "hsl(120, 100%, 60%)", // Green
    };
    
    if (percentage > 80) return colors[statName] || "hsl(var(--pokedex-green))";
    if (percentage > 60) return "hsl(var(--pokedex-yellow))";
    if (percentage > 40) return "hsl(var(--pokedex-blue))";
    return "hsl(var(--muted-foreground))";
  };

  const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
  const averageStats = Math.round(totalStats / pokemon.stats.length);

  return (
    <div className="control-panel animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-digital font-bold text-screen-text">BASE STATS</h4>
        <div className="text-xs font-digital text-screen-text/70">
          TOTAL: {totalStats} | AVG: {averageStats}
        </div>
      </div>
      
      <div className="space-y-3">
        {pokemon.stats.map((stat, index) => {
          const statMax = getStatMax(stat.stat.name);
          const percentage = (stat.base_stat / statMax) * 100;
          const statColor = getStatColor(stat.stat.name, percentage);
          
          return (
            <div 
              key={stat.stat.name} 
              className="space-y-1 animate-slide-in-right"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-between text-sm font-digital">
                <span className="text-screen-text/70 flex items-center">
                  <div 
                    className="w-2 h-2 rounded-full mr-2 led-indicator"
                    style={{ backgroundColor: statColor }}
                  />
                  {pokemonApi.formatStatName(stat.stat.name)}
                </span>
                <span className="text-screen-text font-bold">{stat.base_stat}</span>
              </div>
              <div className="relative">
                <Progress 
                  value={percentage} 
                  className="h-2"
                />
                <div 
                  className="absolute top-0 left-0 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${percentage}%`, 
                    backgroundColor: statColor,
                    boxShadow: `0 0 8px ${statColor}30`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Stat Summary */}
      <div className="mt-4 pt-3 border-t border-border/50">
        <div className="grid grid-cols-2 gap-2 text-xs font-digital">
          <div className="text-center">
            <div className="text-screen-text/70">HIGHEST</div>
            <div className="text-pokedex-green font-bold">
              {pokemon.stats.reduce((max, stat) => 
                stat.base_stat > max.base_stat ? stat : max
              ).base_stat}
            </div>
          </div>
          <div className="text-center">
            <div className="text-screen-text/70">LOWEST</div>
            <div className="text-pokedex-red font-bold">
              {pokemon.stats.reduce((min, stat) => 
                stat.base_stat < min.base_stat ? stat : min
              ).base_stat}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};