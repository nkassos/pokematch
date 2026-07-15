import {PokemonService} from '@/services/PokemonService';
import {drizzle} from 'drizzle-orm/better-sqlite3';
import {PokemonRepository} from '@/repository/PokemonRepository';

const db = drizzle(process.env.DB_FILE_NAME!);
const repository = new PokemonRepository(db);

export const pokemonService = new PokemonService(
    repository,
);
