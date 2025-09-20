import { useState } from "react";
import { PokemonSearch } from "@/components/PokemonSearch";
import { PokemonDisplay } from "@/components/PokemonDisplay";
import { Pokemon } from "@/types/pokemon";

const Index = () => {
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  return (
    <div className="min-h-screen bg-gradient-pokedex p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Pokédex Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-digital font-black text-white text-glow-blue mb-2">
            POKÉDEX
          </h1>
          <div className="flex justify-center items-center space-x-4 mb-6">
            <div className="w-4 h-4 bg-pokedex-yellow rounded-full shadow-lg"></div>
            <div className="w-3 h-3 bg-pokedex-blue rounded-full shadow-lg"></div>
            <div className="w-3 h-3 bg-pokedex-green rounded-full shadow-lg"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full shadow-lg"></div>
          </div>
        </div>

        {/* Main Pokédex Interface */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Panel - Search */}
          <div className="xl:col-span-4 bg-screen-bg screen-border rounded-2xl p-4 shadow-pokedex">
            <div className="bg-gradient-screen rounded-lg p-4">
              <h2 className="text-lg font-digital font-bold text-screen-text mb-4 text-glow-green">
                POKEMON SEARCH
              </h2>
              <PokemonSearch onPokemonSelect={setSelectedPokemon} />
            </div>
          </div>

          {/* Right Panel - Display */}
          <div className="xl:col-span-8 bg-screen-bg screen-border rounded-2xl p-4 shadow-pokedex">
            <div className="bg-gradient-screen rounded-lg p-4">
              <h2 className="text-lg font-digital font-bold text-screen-text mb-4 text-glow-green">
                POKEMON DATA
              </h2>
              {selectedPokemon ? (
                <PokemonDisplay pokemon={selectedPokemon} onPokemonSelect={setSelectedPokemon} />
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 opacity-30 animate-pulse">⚡</div>
                  <p className="text-screen-text opacity-60 font-digital">
                    Search for a Pokémon to view data
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="mt-8 bg-screen-bg screen-border rounded-xl p-4">
          <div className="flex items-center justify-between text-screen-text font-digital text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-pokedex-green rounded-full animate-pulse"></div>
              <span>SYSTEM ONLINE</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>API: POKEAPI.CO</span>
              <span>STATUS: CONNECTED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;