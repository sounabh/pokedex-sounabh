import { Button } from "@/components/ui/button";
import { Pokemon, PokemonSpecies } from "@/types/pokemon";
import { textToSpeech } from "@/utils/textToSpeech";
import { pokemonApi } from "@/utils/pokemonApi";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { useState } from "react";

interface PokemonDescriptionProps {
  pokemon: Pokemon;
  species: PokemonSpecies | null;
  flavorText: string;
  isSpeaking: boolean;
  onToggleSpeech: () => void;
  isLoading: boolean;
}

export const PokemonDescription = ({ 
  pokemon, 
  species, 
  flavorText, 
  isSpeaking, 
  onToggleSpeech,
  isLoading 
}: PokemonDescriptionProps) => {
  const [selectedVersion, setSelectedVersion] = useState<string>('');

  const handleTextToSpeech = () => {
    if (isSpeaking) {
      textToSpeech.stop();
      onToggleSpeech();
    } else if (flavorText) {
      const pokemonName = pokemonApi.formatPokemonName(pokemon.name);
      const typeText = pokemon.types.map(t => t.type.name).join(' and ');
      const speechText = `${pokemonName}, the ${typeText} type Pokémon. ${flavorText}`;
      
      textToSpeech.speak(speechText, onToggleSpeech);
      onToggleSpeech();
    }
  };

  // Get all available versions with flavor text
  const availableVersions = species?.flavor_text_entries
    .filter(entry => entry.language.name === "en")
    .map(entry => entry.version.name)
    .filter((version, index, arr) => arr.indexOf(version) === index)
    .slice(0, 5) || [];

  const getFlavorTextForVersion = (version: string) => {
    const entry = species?.flavor_text_entries.find(
      entry => entry.language.name === "en" && entry.version.name === version
    );
    return entry ? entry.flavor_text.replace(/[\n\f\r]/g, " ") : "";
  };

  const displayText = selectedVersion 
    ? getFlavorTextForVersion(selectedVersion)
    : flavorText;

  return (
    <div className="control-panel animate-fade-in">
      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-pokedex-blue" />
          <span className="ml-2 font-digital text-screen-text text-sm">LOADING DATA...</span>
        </div>
      ) : displayText ? (
        <>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-digital font-bold text-screen-text">POKÉDEX ENTRY</h4>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-pokedex-green led-indicator animate-pulse"></div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTextToSpeech}
                className="text-pokedex-blue hover:text-pokedex-blue-dark hardware-button p-2 h-8"
              >
                {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Version Selector */}
          {availableVersions.length > 1 && (
            <div className="flex flex-wrap gap-1 mb-3">
              <Button
                onClick={() => setSelectedVersion('')}
                className={`text-xs px-2 py-1 h-6 hardware-button ${
                  !selectedVersion ? 'bg-pokedex-blue/20' : ''
                }`}
              >
                LATEST
              </Button>
              {availableVersions.map(version => (
                <Button
                  key={version}
                  onClick={() => setSelectedVersion(version)}
                  className={`text-xs px-2 py-1 h-6 hardware-button ${
                    selectedVersion === version ? 'bg-pokedx-blue/20' : ''
                  }`}
                >
                  {version.toUpperCase()}
                </Button>
              ))}
            </div>
          )}

          <div className="screen-panel p-4">
            <p className="text-screen-text/90 font-mono text-sm leading-relaxed animate-data-scroll">
              {displayText}
            </p>
          </div>

          {/* Additional Species Info */}
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-digital">
            <div className="text-center">
              <div className="text-screen-text/70">CATEGORY</div>
              <div className="text-screen-text font-bold">
                {pokemon.types[0]?.type.name.toUpperCase() || 'UNKNOWN'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-screen-text/70">GENERATION</div>
              <div className="text-screen-text font-bold">
                {pokemon.id <= 151 ? 'I' : 
                 pokemon.id <= 251 ? 'II' :
                 pokemon.id <= 386 ? 'III' :
                 pokemon.id <= 493 ? 'IV' :
                 pokemon.id <= 649 ? 'V' :
                 pokemon.id <= 721 ? 'VI' :
                 pokemon.id <= 809 ? 'VII' :
                 pokemon.id <= 905 ? 'VIII' : 'IX'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-screen-text/70">ORDER</div>
              <div className="text-screen-text font-bold">
                #{pokemon.order}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-6">
          <div className="text-4xl mb-2 opacity-30">📖</div>
          <p className="text-screen-text/60 font-digital text-sm">
            No description available
          </p>
        </div>
      )}
    </div>
  );
};