import { useEffect, useState } from "react";
import { Pokemon, PokemonSpecies, EvolutionChain } from "@/types/pokemon";
import { pokemonApi } from "@/utils/pokemonApi";
import { PokemonBasicInfo } from "./pokemon/PokemonBasicInfo";
import { PokemonStats } from "./pokemon/PokemonStats";
import { PokemonAbilities } from "./pokemon/PokemonAbilities";
import { PokemonMoves } from "./pokemon/PokemonMoves";
import { PokemonDescription } from "./pokemon/PokemonDescription";
import { PokemonEvolution } from "./pokemon/PokemonEvolution";
import { PokemonNavigation } from "./pokemon/PokemonNavigation";

interface PokemonDisplayProps {
  pokemon: Pokemon;
  onPokemonSelect: (pokemon: Pokemon) => void;
}

export const PokemonDisplay = ({ pokemon, onPokemonSelect }: PokemonDisplayProps) => {
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChain | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [flavorText, setFlavorText] = useState<string>("");

  useEffect(() => {
    loadPokemonDetails();
  }, [pokemon.id]);

  const loadPokemonDetails = async () => {
    setIsLoading(true);
    try {
      const speciesData = await pokemonApi.getPokemonSpecies(pokemon.id);
      setSpecies(speciesData);
      
      // Get English flavor text
      const englishEntry = speciesData.flavor_text_entries.find(
        entry => entry.language.name === "en"
      );
      
      if (englishEntry) {
        const cleanText = englishEntry.flavor_text.replace(/[\n\f\r]/g, " ");
        setFlavorText(cleanText);
      }

      // Load evolution chain
      if (speciesData.evolution_chain?.url) {
        const evolutionData = await pokemonApi.getEvolutionChain(speciesData.evolution_chain.url);
        setEvolutionChain(evolutionData);
      }
    } catch (error) {
      console.error("Failed to load Pokémon details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSpeech = () => {
    setIsSpeaking(!isSpeaking);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Navigation Controls */}
      <PokemonNavigation 
        pokemon={pokemon}
        onPokemonSelect={onPokemonSelect}
        isLoading={isLoading}
      />

      {/* Pokemon Basic Info */}
      <PokemonBasicInfo pokemon={pokemon} />

      {/* Pokemon Description with TTS */}
      <PokemonDescription 
        pokemon={pokemon}
        species={species}
        flavorText={flavorText}
        isSpeaking={isSpeaking}
        onToggleSpeech={handleToggleSpeech}
        isLoading={isLoading}
      />

      {/* Stats and Abilities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PokemonStats pokemon={pokemon} />
        <PokemonAbilities pokemon={pokemon} />
      </div>

      {/* Evolution Chain */}
      <PokemonEvolution 
        pokemon={pokemon}
        evolutionChain={evolutionChain}
        onPokemonSelect={onPokemonSelect}
      />

      {/* Moves */}
      <PokemonMoves pokemon={pokemon} />
    </div>
  );
};