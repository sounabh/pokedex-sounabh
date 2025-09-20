import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pokemon } from "@/types/pokemon";
import { pokemonApi } from "@/utils/pokemonApi";
import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, Zap, Target } from "lucide-react";

interface PokemonMovesProps {
  pokemon: Pokemon;
}

export const PokemonMoves = ({ pokemon }: PokemonMovesProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('all');

  // Process moves to get unique moves with latest level learned
  const processedMoves = useMemo(() => {
    const moveMap = new Map();
    
    pokemon.moves.forEach(moveData => {
      const moveName = moveData.move.name;
      const latestVersion = moveData.version_group_details
        .sort((a, b) => b.level_learned_at - a.level_learned_at)[0];
      
      if (!moveMap.has(moveName) || 
          moveMap.get(moveName).level > latestVersion.level_learned_at) {
        moveMap.set(moveName, {
          name: moveName,
          level: latestVersion.level_learned_at,
          method: latestVersion.move_learn_method.name,
          type: 'normal' // We'd need to fetch move details for actual type
        });
      }
    });

    return Array.from(moveMap.values())
      .filter(move => selectedMethod === 'all' || move.method === selectedMethod)
      .sort((a, b) => a.level - b.level);
  }, [pokemon.moves, selectedMethod]);

  const learnMethods = useMemo(() => {
    const methods = new Set(pokemon.moves.flatMap(move => 
      move.version_group_details.map(detail => detail.move_learn_method.name)
    ));
    return Array.from(methods);
  }, [pokemon.moves]);

  const displayMoves = isExpanded ? processedMoves : processedMoves.slice(0, 6);

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'level-up': return <Target className="h-3 w-3" />;
      case 'machine': return <Zap className="h-3 w-3" />;
      default: return <div className="w-3 h-3 rounded-full bg-current" />;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'level-up': return 'hsl(var(--pokedex-green))';
      case 'machine': return 'hsl(var(--pokedex-blue))';
      case 'egg': return 'hsl(var(--pokedex-yellow))';
      case 'tutor': return 'hsl(var(--pokedex-red))';
      default: return 'hsl(var(--muted-foreground))';
    }
  };

  return (
    <div className="control-panel animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-digital font-bold text-screen-text">MOVES</h4>
        <div className="flex items-center space-x-2">
          <div className="text-xs font-digital text-screen-text/70">
            {processedMoves.length} TOTAL
          </div>
          <div className="w-2 h-2 bg-pokedex-yellow led-indicator"></div>
        </div>
      </div>

      {/* Method Filter */}
      <div className="flex flex-wrap gap-1 mb-3">
        <Button
          onClick={() => setSelectedMethod('all')}
          className={`text-xs px-2 py-1 h-6 hardware-button ${
            selectedMethod === 'all' ? 'bg-pokedex-blue/20' : ''
          }`}
        >
          ALL
        </Button>
        {learnMethods.map(method => (
          <Button
            key={method}
            onClick={() => setSelectedMethod(method)}
            className={`text-xs px-2 py-1 h-6 hardware-button ${
              selectedMethod === method ? 'bg-pokedex-blue/20' : ''
            }`}
          >
            {method.replace('-', ' ').toUpperCase()}
          </Button>
        ))}
      </div>

      {/* Moves List */}
      <div className="space-y-1 max-h-40 overflow-y-auto">
        {displayMoves.map((move, index) => (
          <div 
            key={`${move.name}-${move.method}`}
            className="flex items-center justify-between p-2 bg-muted/10 rounded text-xs font-digital animate-slide-in-right data-transition hover:bg-muted/20"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-center space-x-2">
              <div 
                className="flex items-center justify-center"
                style={{ color: getMethodColor(move.method) }}
              >
                {getMethodIcon(move.method)}
              </div>
              <span className="text-screen-text">
                {pokemonApi.formatPokemonName(move.name)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {move.level > 0 && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  Lv.{move.level}
                </Badge>
              )}
              <Badge 
                variant="secondary" 
                className="text-xs px-1 py-0"
                style={{ backgroundColor: getMethodColor(move.method) + '30' }}
              >
                {move.method.replace('-', '').toUpperCase()}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Expand/Collapse Button */}
      {processedMoves.length > 6 && (
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-2 hardware-button text-xs h-8"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-3 w-3 mr-1" />
              SHOW LESS
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3 mr-1" />
              SHOW ALL ({processedMoves.length})
            </>
          )}
        </Button>
      )}
    </div>
  );
};