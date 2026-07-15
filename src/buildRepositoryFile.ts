import { config } from 'dotenv'
import {PokeApiClient} from '@/services/PokeApiClient';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import {PokemonRepository} from '@/repository/PokemonRepository';
import {Pokemon} from '@/domain/Pokemon';

config();

export async function buildCacheFromApi(apiClient: PokeApiClient): Promise<Pokemon[]> {
    const pokemonList: Pokemon[] = [];
    const pokeApiListResponse = await apiClient.getPokemonList(0, 2000);
    for(const pokemonListEntry of pokeApiListResponse.results) {
        const pokemon = await apiClient.getPokemon(pokemonListEntry.name);
        if(pokemon != null) {
            pokemonList.push(pokemon);
        }
    }
    return pokemonList;
}

(async () => {
    const db = drizzle(process.env.DB_FILE_NAME!);
    const repository = new PokemonRepository(db);
    const apiClient = new PokeApiClient(process.env.POKEMON_API_URL!);
    const pokemonList = await buildCacheFromApi(apiClient);
    for(const pokemon of pokemonList) {
        if(pokemon.baseExperience !== null) {
            const check = await repository.getById(pokemon.id);
            if(check) {
                await repository.update(pokemon);
            } else {
                await repository.insert(pokemon);
            }
        }
    }
})();