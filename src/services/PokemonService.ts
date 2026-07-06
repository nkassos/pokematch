import {PokemonMatchCache} from '@/repository';
import { Pokemon } from '@/domain/Pokemon';
import {PokeApiClient} from '@/services/PokeApiClient';

export class PokemonService {

    constructor(
        private readonly pokeApiClient: PokeApiClient,
        private readonly cache: PokemonMatchCache) {
    }

    getById(id: number): Promise<Pokemon | null> {
        return Promise.resolve(this.pokeApiClient.getPokemon(id) ?? null);
    }

    async getMatches(pokemon: Pokemon): Promise<Pokemon[]> {
        const matchingIds = this.cache.get(pokemon.baseExperience) ?? [];

        const matches: Pokemon[] = []
        for(const matchId of matchingIds) {
            if(matchId != pokemon.id) {
                const match = await this.pokeApiClient.getPokemon(matchId);
                if(match != null) {
                    matches.push(match);
                }
            }
        }

        return matches;
    }
}


