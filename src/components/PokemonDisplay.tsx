import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Pokemon, PokemonSpecies, EvolutionChain } from "@/types/pokemon";
import { pokemonApi } from "@/utils/pokemonApi";
import { textToSpeech } from "@/utils/textToSpeech";
import { Volume2, VolumeX, Loader2 } from "lucide-react";

interface PokemonDisplayProps {
  pokemon: Pokemon;
}

export const PokemonDisplay = ({ pokemon }: PokemonDisplayProps) => {
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

  const handleTextToSpeech = () => {
    if (isSpeaking) {
      textToSpeech.stop();
      setIsSpeaking(false);
    } else if (flavorText) {
      setIsSpeaking(true);
      const pokemonName = pokemonApi.formatPokemonName(pokemon.name);
      const speechText = `${pokemonName}. ${flavorText}`;
      
      textToSpeech.speak(speechText, () => {
        setIsSpeaking(false);
      });
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Pokemon Image and Basic Info */}
      <div className="text-center">
        <div className="relative mb-4">
          <img
            src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-48 h-48 mx-auto object-contain"
            style={{
              filter: "drop-shadow(0 0 20px hsl(var(--pokedex-blue) / 0.3))"
            }}
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="font-digital text-lg">
              #{pokemon.id.toString().padStart(3, '0')}
            </Badge>
          </div>
        </div>

        <h3 className="text-3xl font-digital font-bold text-screen-text text-glow-green mb-2">
          {pokemonApi.formatPokemonName(pokemon.name)}
        </h3>

        {/* Types */}
        <div className="flex justify-center space-x-2 mb-4">
          {pokemon.types.map((type) => (
            <Badge
              key={type.slot}
              className="font-digital text-white font-semibold px-3 py-1"
              style={{
                backgroundColor: pokemonApi.getTypeColor(type.type.name),
              }}
            >
              {type.type.name.toUpperCase()}
            </Badge>
          ))}
        </div>

        {/* Physical Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-muted/20 rounded-lg p-3">
            <div className="text-screen-text/70 font-digital text-sm">HEIGHT</div>
            <div className="text-screen-text font-digital font-bold">
              {(pokemon.height / 10).toFixed(1)}m
            </div>
          </div>
          <div className="bg-muted/20 rounded-lg p-3">
            <div className="text-screen-text/70 font-digital text-sm">WEIGHT</div>
            <div className="text-screen-text font-digital font-bold">
              {(pokemon.weight / 10).toFixed(1)}kg
            </div>
          </div>
        </div>
      </div>

      {/* Description and TTS */}
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-pokedex-blue" />
        </div>
      ) : flavorText && (
        <div className="bg-muted/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-digital font-bold text-screen-text">DESCRIPTION</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleTextToSpeech}
              className="text-pokedex-blue hover:text-pokedex-blue-dark"
            >
              {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-screen-text/90 font-mono text-sm leading-relaxed">
            {flavorText}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="space-y-3">
        <h4 className="font-digital font-bold text-screen-text">BASE STATS</h4>
        {pokemon.stats.map((stat) => {
          const statMax = getStatMax(stat.stat.name);
          const percentage = (stat.base_stat / statMax) * 100;
          
          return (
            <div key={stat.stat.name} className="space-y-1">
              <div className="flex justify-between text-sm font-digital">
                <span className="text-screen-text/70">
                  {pokemonApi.formatStatName(stat.stat.name)}
                </span>
                <span className="text-screen-text font-bold">{stat.base_stat}</span>
              </div>
              <Progress 
                value={percentage} 
                className="h-2"
              />
            </div>
          );
        })}
      </div>

      {/* Abilities */}
      <div className="space-y-2">
        <h4 className="font-digital font-bold text-screen-text">ABILITIES</h4>
        <div className="space-y-1">
          {pokemon.abilities.map((ability) => (
            <div 
              key={ability.slot} 
              className="flex justify-between text-sm font-digital"
            >
              <span className="text-screen-text">
                {pokemonApi.formatPokemonName(ability.ability.name)}
              </span>
              {ability.is_hidden && (
                <Badge variant="outline" className="text-xs">HIDDEN</Badge>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};