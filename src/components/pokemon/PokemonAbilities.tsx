import { Badge } from "@/components/ui/badge";
import { Pokemon } from "@/types/pokemon";
import { pokemonApi } from "@/utils/pokemonApi";
import { Eye, EyeOff } from "lucide-react";

interface PokemonAbilitiesProps {
  pokemon: Pokemon;
}

export const PokemonAbilities = ({ pokemon }: PokemonAbilitiesProps) => {
  return (
    <div className="control-panel animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-digital font-bold text-screen-text">ABILITIES</h4>
        <div className="w-2 h-2 bg-pokedex-blue led-indicator"></div>
      </div>
      
      <div className="space-y-2">
        {pokemon.abilities.map((ability, index) => (
          <div 
            key={ability.slot} 
            className="flex items-center justify-between p-2 bg-muted/10 rounded-lg animate-slide-in-left data-transition hover:bg-muted/20"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center space-x-2">
              {ability.is_hidden ? (
                <EyeOff className="h-3 w-3 text-pokedex-yellow" />
              ) : (
                <Eye className="h-3 w-3 text-pokedex-blue" />
              )}
              <span className="text-screen-text font-digital text-sm">
                {pokemonApi.formatPokemonName(ability.ability.name)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {ability.is_hidden && (
                <Badge variant="outline" className="text-xs px-2 py-0 font-digital">
                  HIDDEN
                </Badge>
              )}
              <Badge 
                variant="secondary" 
                className="text-xs px-2 py-0 font-digital"
              >
                SLOT {ability.slot}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 text-xs font-digital text-screen-text/70 text-center">
        {pokemon.abilities.filter(a => !a.is_hidden).length} NORMAL • {pokemon.abilities.filter(a => a.is_hidden).length} HIDDEN
      </div>
    </div>
  );
};