export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  order: number;
  types: PokemonType[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  sprites: PokemonSprites;
  moves: PokemonMove[];
  species: {
    name: string;
    url: string;
  };
  forms: PokemonForm[];
  game_indices: GameIndex[];
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  back_default: string | null;
  back_shiny: string | null;
  other: {
    'official-artwork': {
      front_default: string | null;
    };
    dream_world: {
      front_default: string | null;
    };
    home: {
      front_default: string | null;
      front_shiny: string | null;
    };
    showdown: {
      front_default: string | null;
      front_shiny: string | null;
      back_default: string | null;
      back_shiny: string | null;
    };
  };
}

export interface PokemonSpecies {
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
    version: {
      name: string;
    };
  }>;
  evolution_chain: {
    url: string;
  };
}

export interface EvolutionChain {
  chain: EvolutionChainLink;
}

export interface EvolutionChainLink {
  evolution_details: EvolutionDetail[];
  evolves_to: EvolutionChainLink[];
  is_baby: boolean;
  species: {
    name: string;
    url: string;
  };
}

export interface EvolutionDetail {
  min_level: number | null;
  min_happiness: number | null;
  min_beauty: number | null;
  min_affection: number | null;
  needs_overworld_rain: boolean;
  party_species: any | null;
  party_type: any | null;
  relative_physical_stats: number | null;
  time_of_day: string;
  trade_species: any | null;
  trigger: {
    name: string;
    url: string;
  };
  turn_upside_down: boolean;
}

export interface PokemonMove {
  move: {
    name: string;
    url: string;
  };
  version_group_details: MoveVersionDetail[];
}

export interface MoveVersionDetail {
  level_learned_at: number;
  move_learn_method: {
    name: string;
    url: string;
  };
  version_group: {
    name: string;
    url: string;
  };
}

export interface PokemonForm {
  name: string;
  url: string;
}

export interface GameIndex {
  game_index: number;
  version: {
    name: string;
    url: string;
  };
}

export interface MoveDetails {
  id: number;
  name: string;
  accuracy: number | null;
  power: number | null;
  pp: number;
  priority: number;
  type: {
    name: string;
    url: string;
  };
  damage_class: {
    name: string;
    url: string;
  };
  effect_entries: Array<{
    effect: string;
    short_effect: string;
    language: {
      name: string;
      url: string;
    };
  }>;
}