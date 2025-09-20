import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pokemon, EvolutionChain, EvolutionChainLink } from "@/types/pokemon";
import { pokemonApi } from "@/utils/pokemonApi";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface PokemonEvolutionProps {
  pokemon: Pokemon;
  evolutionChain: EvolutionChain | null;
  onPokemonSelect: (pokemon: Pokemon) => void;
}

interface EvolutionData {
  species: string;
  id: number;
  sprite: string;
  level?: number;
  trigger?: string;
  item?: string;
  happiness?: number;
}

export const PokemonEvolution = ({ pokemon, evolutionChain, onPokemonSelect }: PokemonEvolutionProps) => {
  const [evolutionData, setEvolutionData] = useState<EvolutionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (evolutionChain) {
      loadEvolutionData();
    }
  }, [evolutionChain]);

  const loadEvolutionData = async () => {
    if (!evolutionChain) return;
    
    setIsLoading(true);
    try {
      const evolutions: EvolutionData[] = [];
      await processEvolutionChain(evolutionChain.chain, evolutions);
      setEvolutionData(evolutions);
    } catch (error) {
      console.error("Failed to load evolution data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const processEvolutionChain = async (chain: EvolutionChainLink, evolutions: EvolutionData[]) => {
    try {
      // Extract species ID from URL
      const speciesId = chain.species.url.split('/').slice(-2, -1)[0];
      const pokemonData = await pokemonApi.getPokemon(parseInt(speciesId));
      
      const evolutionInfo: EvolutionData = {
        species: chain.species.name,
        id: pokemonData.id,
        sprite: pokemonData.sprites.other['official-artwork'].front_default || pokemonData.sprites.front_default || '',
      };

      // Add evolution details if this isn't the base form
      if (chain.evolution_details.length > 0) {
        const detail = chain.evolution_details[0];
        evolutionInfo.level = detail.min_level;
        evolutionInfo.trigger = detail.trigger.name;
        evolutionInfo.happiness = detail.min_happiness;
      }

      evolutions.push(evolutionInfo);

      // Process next evolutions
      for (const nextEvolution of chain.evolves_to) {
        await processEvolutionChain(nextEvolution, evolutions);
      }
    } catch (error) {
      console.error(`Failed to load Pokemon ${chain.species.name}:`, error);
    }
  };

  const handleEvolutionSelect = async (evolution: EvolutionData) => {
    try {
      const selectedPokemon = await pokemonApi.getPokemon(evolution.id);
      onPokemonSelect(selectedPokemon);
    } catch (error) {
      console.error("Failed to load selected evolution:", error);
    }
  };

  const getEvolutionRequirement = (evolution: EvolutionData) => {
    if (evolution.level) return `Lv. ${evolution.level}`;
    if (evolution.happiness) return `Happiness ${evolution.happiness}`;
    if (evolution.trigger === 'trade') return 'Trade';
    if (evolution.trigger === 'use-item') return evolution.item || 'Item';
    if (evolution.trigger === 'level-up') return 'Level Up';
    return evolution.trigger || '';
  };

  if (isLoading) {
    return (
      <div className="control-panel animate-fade-in">
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-pokedex-blue" />
          <span className="ml-2 font-digital text-screen-text text-sm">LOADING EVOLUTION...</span>
        </div>
      </div>
    );
  }

  if (!evolutionChain || evolutionData.length <= 1) {
    return (
      <div className="control-panel animate-fade-in">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-digital font-bold text-screen-text">EVOLUTION CHAIN</h4>
          <div className="w-2 h-2 bg-muted led-indicator"></div>
        </div>
        <div className="text-center py-6">
          <div className="text-4xl mb-2 opacity-30">🔗</div>
          <p className="text-screen-text/60 font-digital text-sm">
            This Pokémon does not evolve
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="control-panel animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-digital font-bold text-screen-text">EVOLUTION CHAIN</h4>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-pokedex-green led-indicator animate-pulse"></div>
          <div className="text-xs font-digital text-screen-text/70">
            {evolutionData.length} FORMS
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {evolutionData.map((evolution, index) => (
          <div key={evolution.id} className="animate-slide-in-right" style={{ animationDelay: `${index * 0.1}s` }}>
            {index > 0 && (
              <div className="flex items-center justify-center mb-2">
                <div className="flex items-center space-x-2 text-xs font-digital text-screen-text/70">
                  <ArrowRight className="h-3 w-3" />
                  <span>{getEvolutionRequirement(evolution)}</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            )}
            
            <Button
              onClick={() => handleEvolutionSelect(evolution)}
              className={`w-full p-3 hardware-button ${
                evolution.id === pokemon.id ? 'bg-pokedx-green/20 border-pokedex-green' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={evolution.sprite}
                  alt={evolution.species}
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
                <div className="flex-1 text-left">
                  <div className="font-digital font-bold text-sm">
                    {pokemonApi.formatPokemonName(evolution.species)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    #{evolution.id.toString().padStart(3, '0')}
                  </div>
                </div>
                {evolution.id === pokemon.id && (
                  <Badge variant="secondary" className="font-digital text-xs">
                    CURRENT
                  </Badge>
                )}
              </div>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};