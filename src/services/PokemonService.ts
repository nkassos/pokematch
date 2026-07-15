import { Pokemon } from '@/domain/Pokemon';
import {PokemonRepository} from '@/repository/PokemonRepository';

export class PokemonService {

    constructor(
        private readonly repository: PokemonRepository) {
    }

    async getById(id: number): Promise<Pokemon | null> {
        return await this.repository.getById(id) ?? null;
    }

    async getMatches(pokemon: Pokemon): Promise<Pokemon[]> {
        return this.repository.getByBaseExperience(pokemon.baseExperience);
    }

    async search(params: PokemonSearchParams): Promise<PokemonSearchResult> {
        if(params.id) {
            const pokemon = await this.repository.getById(params.id);
            return pokemon ? {
                pokemon: [pokemon],
                totalCount: 1,
            } : {
                pokemon: [],
                totalCount: 0,
            };
        } else {
            const limit = params.limit ?? 0;
            const offset = params.page ? (params.page - 1) * limit : undefined;
            return this.repository.search(params.name ?? null, offset, limit);
        }

    }

}

interface PokemonSearchResult {
    pokemon: Pokemon[];
    totalCount: number;
}

interface PokemonSearchParams {
    name?: string,
    id?: number,
    page?: number,
    limit?: number,
}
