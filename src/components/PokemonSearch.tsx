import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Pokemon } from "@/types/pokemon";
import { pokemonApi } from "@/utils/pokemonApi";
import { Loader2, Search, Filter, X } from "lucide-react";

interface PokemonSearchProps {
  onPokemonSelect: (pokemon: Pokemon | null) => void;
}

export const PokemonSearch = ({ onPokemonSelect }: PokemonSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTypeFilter, setShowTypeFilter] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const { toast } = useToast();

  const pokemonTypes = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];

  const popularPokemon = [
    { name: "pikachu", id: 25 },
    { name: "charizard", id: 6 },
    { name: "mewtwo", id: 150 },
    { name: "lucario", id: 448 },
    { name: "gardevoir", id: 282 },
    { name: "rayquaza", id: 384 }
  ];

  const handleSearch = async (searchValue?: string) => {
    const term = searchValue || searchTerm;
    if (!term.trim()) {
      toast({
        title: "Search Error",
        description: "Please enter a Pokémon name or ID",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const pokemon = await pokemonApi.getPokemon(term.toLowerCase().trim());
      onPokemonSelect(pokemon);
      toast({
        title: "Pokémon Found!",
        description: `Successfully loaded ${pokemonApi.formatPokemonName(pokemon.name)}`,
      });
    } catch (error) {
      toast({
        title: "Pokémon Not Found",
        description: "Please check the spelling or try a different Pokémon",
        variant: "destructive",
      });
      onPokemonSelect(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeFilter = async (type: string) => {
    setIsLoading(true);
    try {
      const typeData = await pokemonApi.searchPokemonByType(type);
      if (typeData.pokemon.length > 0) {
        // Get a random Pokémon of this type
        const randomIndex = Math.floor(Math.random() * Math.min(20, typeData.pokemon.length));
        const selectedPokemonData = typeData.pokemon[randomIndex].pokemon;
        const pokemon = await pokemonApi.getPokemon(selectedPokemonData.name);
        onPokemonSelect(pokemon);
        toast({
          title: `${type.toUpperCase()} Type Found!`,
          description: `Found ${pokemonApi.formatPokemonName(pokemon.name)}`,
        });
      }
    } catch (error) {
      toast({
        title: "Search Failed",
        description: `Could not find ${type} type Pokémon`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRandomPokemon = async () => {
    setIsLoading(true);
    try {
      const pokemon = await pokemonApi.getRandomPokemon();
      onPokemonSelect(pokemon);
      toast({
        title: "Random Pokémon!",
        description: `Found ${pokemonApi.formatPokemonName(pokemon.name)}`,
      });
    } catch (error) {
      toast({
        title: "Random Search Failed",
        description: "Could not load random Pokémon",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Main Search */}
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Enter Pokémon name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="font-digital bg-screen-bg border-screen-border text-screen-text placeholder:text-screen-text/50"
          disabled={isLoading}
        />
        <Button
          onClick={() => handleSearch()}
          disabled={isLoading}
          className="hardware-button bg-pokedex-blue/80 hover:bg-pokedex-blue text-white"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Control Buttons */}
      <div className="flex space-x-2">
        <Button
          onClick={handleRandomPokemon}
          disabled={isLoading}
          className="hardware-button bg-pokedex-yellow/80 hover:bg-pokedex-yellow text-black flex-1"
        >
          🎲 RANDOM
        </Button>
        <Button
          onClick={() => setShowTypeFilter(!showTypeFilter)}
          className={`hardware-button flex-1 ${showTypeFilter ? 'bg-pokedex-green/20' : ''}`}
        >
          <Filter className="h-4 w-4 mr-1" />
          TYPES
        </Button>
      </div>

      {/* Type Filter */}
      {showTypeFilter && (
        <div className="control-panel animate-slide-in-right">
          <div className="flex items-center justify-between mb-2">
            <span className="font-digital text-sm text-screen-text">SELECT TYPE</span>
            <Button
              onClick={() => setShowTypeFilter(false)}
              className="p-1 h-6 w-6 hardware-button"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {pokemonTypes.map((type) => (
              <Button
                key={type}
                onClick={() => handleTypeFilter(type)}
                disabled={isLoading}
                className="hardware-button text-xs p-1 h-8"
                style={{
                  backgroundColor: pokemonApi.getTypeColor(type) + '30',
                  borderColor: pokemonApi.getTypeColor(type)
                }}
              >
                {type.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Access Buttons */}
      <div className="control-panel">
        <div className="text-xs font-digital text-screen-text/70 mb-2">POPULAR POKÉMON</div>
        <div className="grid grid-cols-3 gap-2">
          {popularPokemon.map((pokemon) => (
            <Button
              key={pokemon.name}
              onClick={() => handleSearch(pokemon.name)}
              disabled={isLoading}
              className="hardware-button text-xs p-2 h-10"
            >
              <div className="text-center">
                <div className="font-bold">{pokemon.name.toUpperCase()}</div>
                <div className="text-xs opacity-70">#{pokemon.id}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};