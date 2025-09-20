import axios from "axios";
import { Pokemon, PokemonSpecies, EvolutionChain, MoveDetails } from "@/types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";

class PokemonApi {
  private async get<T>(url: string): Promise<T> {
    try {
      const response = await axios.get<T>(url);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch data from ${url}`);
    }
  }

  async getPokemon(nameOrId: string | number): Promise<Pokemon> {
    return this.get<Pokemon>(`${BASE_URL}/pokemon/${nameOrId}`);
  }

  async getPokemonSpecies(nameOrId: string | number): Promise<PokemonSpecies> {
    return this.get<PokemonSpecies>(`${BASE_URL}/pokemon-species/${nameOrId}`);
  }

  async getEvolutionChain(url: string): Promise<EvolutionChain> {
    return this.get<EvolutionChain>(url);
  }

  async getMove(nameOrId: string | number): Promise<MoveDetails> {
    return this.get<MoveDetails>(`${BASE_URL}/move/${nameOrId}`);
  }

  async getRandomPokemon(): Promise<Pokemon> {
    // Generate random ID between 1 and 1010 (current total Pokémon count)
    const randomId = Math.floor(Math.random() * 1010) + 1;
    return this.getPokemon(randomId);
  }

  async searchPokemonByType(type: string): Promise<{pokemon: Array<{pokemon: {name: string; url: string}}>}> {
    return this.get<{pokemon: Array<{pokemon: {name: string; url: string}}>}>(`${BASE_URL}/type/${type}`);
  }

  getNextPokemonId(currentId: number): number {
    return currentId >= 1010 ? 1 : currentId + 1;
  }

  getPreviousPokemonId(currentId: number): number {
    return currentId <= 1 ? 1010 : currentId - 1;
  }

  getTypeColor(type: string): string {
    const typeColors: Record<string, string> = {
      normal: "hsl(165, 19%, 50%)",
      fire: "hsl(25, 85%, 55%)",
      water: "hsl(225, 73%, 57%)",
      electric: "hsl(48, 100%, 50%)",
      grass: "hsl(100, 50%, 43%)",
      ice: "hsl(180, 85%, 70%)",
      fighting: "hsl(5, 78%, 40%)",
      poison: "hsl(300, 43%, 50%)",
      ground: "hsl(45, 85%, 60%)",
      flying: "hsl(225, 73%, 73%)",
      psychic: "hsl(340, 73%, 65%)",
      bug: "hsl(65, 50%, 43%)",
      rock: "hsl(45, 85%, 40%)",
      ghost: "hsl(260, 33%, 43%)",
      dragon: "hsl(260, 73%, 50%)",
      dark: "hsl(24, 19%, 24%)",
      steel: "hsl(225, 8%, 58%)",
      fairy: "hsl(315, 73%, 73%)",
    };
    return typeColors[type] || "hsl(0, 0%, 50%)";
  }

  formatStatName(statName: string): string {
    const statNames: Record<string, string> = {
      "hp": "HP",
      "attack": "ATK",
      "defense": "DEF",
      "special-attack": "SP.ATK",
      "special-defense": "SP.DEF",
      "speed": "SPEED",
    };
    return statNames[statName] || statName.toUpperCase();
  }

  formatPokemonName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ");
  }
}

export const pokemonApi = new PokemonApi();