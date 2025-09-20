import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Pokemon } from "@/types/pokemon";
import { pokemonApi } from "@/utils/pokemonApi";
import { Loader2, Search } from "lucide-react";

interface PokemonSearchProps {
  onPokemonSelect: (pokemon: Pokemon | null) => void;
}

export const PokemonSearch = ({ onPokemonSelect }: PokemonSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Search Error",
        description: "Please enter a Pokémon name or ID",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const pokemon = await pokemonApi.getPokemon(searchTerm.toLowerCase().trim());
      onPokemonSelect(pokemon);
      toast({
        title: "Pokémon Found!",
        description: `Successfully loaded ${pokemon.name}`,
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
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
          onClick={handleSearch}
          disabled={isLoading}
          className="bg-pokedex-blue hover:bg-pokedex-blue-dark text-white font-digital"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Quick Access Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {["pikachu", "charizard", "mewtwo", "lucario", "gardevoir", "rayquaza"].map((name) => (
          <Button
            key={name}
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm(name);
              setTimeout(() => handleSearch(), 100);
            }}
            disabled={isLoading}
            className="font-digital text-xs bg-muted/20 border-screen-border hover:bg-pokedex-blue/20 text-screen-text"
          >
            {name}
          </Button>
        ))}
      </div>
    </div>
  );
};