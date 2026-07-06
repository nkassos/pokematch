import {Pokemon} from '@/domain/Pokemon';

export class PokeApiClient {
    constructor(readonly baseUrl: string) {
    }

    async getPokemonList(offset: number, limit: number): Promise<PokeApiListResponse> {
        const res = await fetch(
            `${this.baseUrl}/pokemon?offset=${offset ?? 0}&limit=${limit ?? 20}`
        );
        return res.json()
    }

    async getPokemon(identifier: string | number): Promise<Pokemon | null> {
        const res = await fetch(`${this.baseUrl}/pokemon/${identifier}`);
        if(res.ok) {
            return mapApiPokemonToPokemon(await res.json());
        } else {
            return null
        }
    }
}

export interface PokemonListEntry {
    name: string;
    url: string;
}

export interface PokeApiListResponse {
    count: number;
    next: string;
    previous: string;
    results: PokemonListEntry[]
}

export interface PokeApiPokemonDetail {
    id: number;
    name: string;
    base_experience: number;
    height: number;
    weight: number;
    sprites: PokeApiPokemonSprites;
}

interface PokeApiPokemonSprites {
    front_default: string | null;
    front_shiny: string | null;
    front_female: string | null;
    front_shiny_female: string | null;
    back_default: string | null;
    back_shiny: string | null;
    back_female: string | null;
    back_shiny_female: string | null;
    other?: PokeApiOtherSprites;
}

interface PokeApiOtherSprites {
    "dream_world"?: {
        front_default: string | null;
        front_female: string | null;
    };
    "official-artwork"?: {
        front_default: string | null;
        front_shiny: string | null;
    };
    "home"?: {
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
    };
}

function mapApiPokemonToPokemon(api: PokeApiPokemonDetail): Pokemon {
    return {
        id: api.id,
        name: api.name,
        baseExperience: api.base_experience,
        height: api.height,
        weight: api.weight,
        profilePhoto: getProfilePhoto(api),
        additionalPhotos: getAdditionalPhotos(api),
    }
}

function getProfilePhoto(pokemon: PokeApiPokemonDetail): string | null {
    return pokemon.sprites.other?.home?.front_default ??
        pokemon.sprites.other?.['official-artwork']?.front_default ??
        pokemon.sprites.front_default;
}

type BaseSpriteKey =
    | "back_default"
    | "back_female"
    | "back_shiny"
    | "back_shiny_female"
    | "front_default"
    | "front_female"
    | "front_shiny"
    | "front_shiny_female";

const spriteKeys: BaseSpriteKey[] = [
    "back_default",
    "back_female",
    "back_shiny",
    "back_shiny_female",
    "front_default",
    "front_female",
    "front_shiny",
    "front_shiny_female",
]

function getAdditionalPhotos(pokemon: PokeApiPokemonDetail): string[] {
    return spriteKeys.reduce((acc: string[], key) => {
        const value = pokemon.sprites[key];
        if(value) {
            acc.push(value);
        }
        return acc
    }, []);
}
