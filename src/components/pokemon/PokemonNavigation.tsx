import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Shuffle, Search } from "lucide-react";
import { Pokemon } from "@/types/pokemon";
import { pokemonApi } from "@/utils/pokemonApi";

interface PokemonNavigationProps {
  pokemon: Pokemon | null;
  onPokemonSelect: (pokemon: Pokemon) => void;
  isLoading: boolean;
}

export const PokemonNavigation = ({ pokemon, onPokemonSelect, isLoading }: PokemonNavigationProps) => {
  const handlePrevious = async () => {
    if (!pokemon) return;
    try {
      const prevId = pokemonApi.getPreviousPokemonId(pokemon.id);
      const prevPokemon = await pokemonApi.getPokemon(prevId);
      onPokemonSelect(prevPokemon);
    } catch (error) {
      console.error("Failed to load previous Pokémon:", error);
    }
  };

  const handleNext = async () => {
    if (!pokemon) return;
    try {
      const nextId = pokemonApi.getNextPokemonId(pokemon.id);
      const nextPokemon = await pokemonApi.getPokemon(nextId);
      onPokemonSelect(nextPokemon);
    } catch (error) {
      console.error("Failed to load next Pokémon:", error);
    }
  };

  const handleRandom = async () => {
    try {
      const randomPokemon = await pokemonApi.getRandomPokemon();
      onPokemonSelect(randomPokemon);
    } catch (error) {
      console.error("Failed to load random Pokémon:", error);
    }
  };

  return (
    <div className="control-panel">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-digital font-bold text-screen-text text-sm">NAVIGATION</h3>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-pokedex-green led-indicator"></div>
          <div className="w-2 h-2 bg-pokedex-blue led-indicator"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <Button
          onClick={handlePrevious}
          disabled={isLoading || !pokemon}
          className="hardware-button text-xs p-2 h-10"
        >
          <ChevronLeft className="h-4 w-4" />
          PREV
        </Button>
        
        <Button
          onClick={handleRandom}
          disabled={isLoading}
          className="hardware-button text-xs p-2 h-10 bg-gradient-to-b from-pokedex-yellow/80 to-pokedex-yellow/40 hover:from-pokedex-yellow hover:to-pokedex-yellow/60"
        >
          <Shuffle className="h-4 w-4" />
          RAND
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={isLoading || !pokemon}
          className="hardware-button text-xs p-2 h-10"
        >
          <ChevronRight className="h-4 w-4" />
          NEXT
        </Button>
      </div>

      {pokemon && (
        <div className="mt-3 text-center">
          <div className="text-xs font-digital text-screen-text/70">
            ID: #{pokemon.id.toString().padStart(3, '0')}
          </div>
        </div>
      )}
    </div>
  );
};