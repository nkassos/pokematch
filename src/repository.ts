import {PokeApiClient} from '@/services/PokeApiClient';
import * as fs from 'node:fs';

export type PokemonMatchCache = Map<number, Array<number>>;

export async function writeCacheToFile(path: string, cache: PokemonMatchCache): Promise<void> {
    const file = fs.openSync(path, 'w')
    fs.writeSync(file, JSON.stringify([...cache.entries()]));
    fs.closeSync(file);
}

export async function readCacheFromFile(path: string): Promise<PokemonMatchCache | null> {
    if(fs.existsSync(path)) {
        const file = fs.openSync(path, 'r')
        const json = fs.readFileSync(file, 'utf-8');
        return new Map(JSON.parse(json));
    }
    return null
}

export async function buildCacheFromApi(apiClient: PokeApiClient): Promise<PokemonMatchCache> {
    const matchCache: PokemonMatchCache = new Map();
    const pokeList = await apiClient.getPokemonList(0, 2000);
    for(const pokemonListEntry of pokeList.results) {
        const pokemon = await apiClient.getPokemon(pokemonListEntry.name);
        if(pokemon != null) {
            const matchArray = matchCache.get(pokemon.baseExperience) ?? [];
            matchArray.push(pokemon.id);
            matchCache.set(pokemon.baseExperience, matchArray);
        }
    }
    return matchCache;
}

