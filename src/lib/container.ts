import {PokeApiClient} from '@/services/PokeApiClient';
import {PokemonService} from '@/services/PokemonService';
import {readCacheFromFile} from '@/repository';

export const apiClient = new PokeApiClient(process.env.POKEMON_API_URL!);

const cache = await readCacheFromFile(process.env.CACHE_FILE!);
if(cache == null) throw Error('Invalid Cache');

export const pokemonService = new PokemonService(
    apiClient,
    cache
);
