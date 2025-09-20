import { Badge } from "@/components/ui/badge";
import { Pokemon } from "@/types/pokemon";
import { pokemonApi } from "@/utils/pokemonApi";
import { useState } from "react";

interface PokemonBasicInfoProps {
  pokemon: Pokemon;
}

export const PokemonBasicInfo = ({ pokemon }: PokemonBasicInfoProps) => {
  const [imageType, setImageType] = useState<'default' | 'shiny'>('default');
  const [showBack, setShowBack] = useState(false);

  const getImageUrl = () => {
    if (showBack) {
      return imageType === 'shiny' 
        ? pokemon.sprites.back_shiny || pokemon.sprites.back_default
        : pokemon.sprites.back_default;
    }
    
    if (imageType === 'shiny') {
      return pokemon.sprites.front_shiny || 
             pokemon.sprites.other['official-artwork'].front_default || 
             pokemon.sprites.front_default;
    }
    
    return pokemon.sprites.other['official-artwork'].front_default || 
           pokemon.sprites.front_default;
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Pokemon Image */}
      <div className="text-center">
        <div className="relative mb-4 group">
          <div className="screen-panel p-4">
            <img
              src={getImageUrl()}
              alt={pokemon.name}
              className="w-48 h-48 mx-auto object-contain data-transition hover:scale-105"
              style={{
                filter: "drop-shadow(0 0 20px hsl(var(--pokedex-blue) / 0.3))"
              }}
              onError={(e) => {
                e.currentTarget.src = pokemon.sprites.front_default || '';
              }}
            />
          </div>
          
          {/* Image Controls */}
          <div className="absolute top-2 right-2 space-y-1">
            <Badge 
              variant="secondary" 
              className="font-digital text-xs cursor-pointer animate-scale-in"
              onClick={() => setImageType(imageType === 'default' ? 'shiny' : 'default')}
            >
              {imageType === 'shiny' ? '✨ SHINY' : '🎨 NORMAL'}
            </Badge>
            {(pokemon.sprites.back_default || pokemon.sprites.back_shiny) && (
              <Badge 
                variant="outline" 
                className="font-digital text-xs cursor-pointer block animate-scale-in"
                onClick={() => setShowBack(!showBack)}
              >
                {showBack ? 'FRONT' : 'BACK'}
              </Badge>
            )}
          </div>
        </div>

        <h3 className="text-3xl font-digital font-bold text-screen-text text-glow-green mb-2 animate-data-scroll">
          {pokemonApi.formatPokemonName(pokemon.name)}
        </h3>

        {/* Types */}
        <div className="flex justify-center space-x-2 mb-4 animate-slide-in-left">
          {pokemon.types.map((type, index) => (
            <Badge
              key={type.slot}
              className="font-digital text-white font-semibold px-3 py-1 animate-scale-in"
              style={{
                backgroundColor: pokemonApi.getTypeColor(type.type.name),
                animationDelay: `${index * 0.1}s`
              }}
            >
              {type.type.name.toUpperCase()}
            </Badge>
          ))}
        </div>

        {/* Physical Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="control-panel animate-slide-in-left">
            <div className="text-screen-text/70 font-digital text-xs">HEIGHT</div>
            <div className="text-screen-text font-digital font-bold text-lg">
              {(pokemon.height / 10).toFixed(1)}m
            </div>
          </div>
          <div className="control-panel animate-fade-in" style={{animationDelay: '0.1s'}}>
            <div className="text-screen-text/70 font-digital text-xs">WEIGHT</div>
            <div className="text-screen-text font-digital font-bold text-lg">
              {(pokemon.weight / 10).toFixed(1)}kg
            </div>
          </div>
          <div className="control-panel animate-slide-in-right" style={{animationDelay: '0.2s'}}>
            <div className="text-screen-text/70 font-digital text-xs">EXP</div>
            <div className="text-screen-text font-digital font-bold text-lg">
              {pokemon.base_experience || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};