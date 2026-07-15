import {BetterSQLite3Database} from 'drizzle-orm/better-sqlite3';
import {Pokemon} from '@/domain/Pokemon';
import {pokemonImageTable, pokemonTable} from '@/db/schema';
import {eq, inArray, like} from 'drizzle-orm/sql/expressions';
import {count, InferInsertModel, InferSelectModel} from 'drizzle-orm';

export class PokemonRepository {

    constructor(private readonly db: BetterSQLite3Database) {
    }

    async insert(pokemon: Pokemon) {
        this.db.insert(pokemonTable)
            .values(mapPokemonToRow(pokemon))
            .run()

        this.insertImages(pokemon)
    }

    async update(pokemon: Pokemon) {
        this.db.update(pokemonTable)
            .set(mapPokemonToRow(pokemon))
            .where(
                eq(pokemonTable.id, pokemon.id)
            )
            .run()
    }

    private insertImages(pokemon: Pokemon) {
        const imageRows = mapPokemonToImageRows(pokemon);
        if (imageRows.length > 0) {
            this.db.insert(pokemonImageTable)
                .values(imageRows)
                .run()
        }
    }

    async getById(id: number): Promise<Pokemon | undefined> {
        const row = this.db.select()
            .from(pokemonTable)
            .where(
                eq(pokemonTable.id, id)
            )
            .get()
        if (!row) {
            return undefined;
        }

        const images = this.db.select()
            .from(pokemonImageTable)
            .where(
                eq(pokemonImageTable.pokemonId, id)
            )
            .all()
        return mapRowToPokemon(row, images);
    }

    async getByBaseExperience(baseExperience: number): Promise<Pokemon[]> {
        const rows = this.db.select()
            .from(pokemonTable)
            .where(
                eq(pokemonTable.baseExperience, baseExperience)
            )
            .orderBy(pokemonTable.name)
            .all()
        return this.mapRowsToPokemon(rows);
    }

    async search(name: string | null, offset: number = 0, limit: number = 0): Promise<{ pokemon: Pokemon[], totalCount: number }> {
        const whereClause = name ? like(pokemonTable.name, `%${name}%`) : undefined;

        let query = this.db.select()
            .from(pokemonTable)
            .where(whereClause)
            .offset(offset)
            .orderBy(pokemonTable.name)
            .$dynamic();

        if(limit) {
            query = query.limit(limit)
        }

        const rows = query.all()

        const totalCount = this.db.select({ value: count() })
            .from(pokemonTable)
            .where(whereClause)
            .get()?.value ?? 0

        return { pokemon: this.mapRowsToPokemon(rows), totalCount };
    }

    private mapRowsToPokemon(rows: InferSelectModel<typeof pokemonTable>[]): Pokemon[] {
        if (rows.length === 0) {
            return [];
        }

        const images = this.db.select()
            .from(pokemonImageTable)
            .where(
                inArray(pokemonImageTable.pokemonId, rows.map((row) => row.id))
            )
            .all()

        const imagesByPokemonId = new Map<number, InferSelectModel<typeof pokemonImageTable>[]>();
        for (const image of images) {
            const imageRows = imagesByPokemonId.get(image.pokemonId) ?? [];
            imageRows.push(image);
            imagesByPokemonId.set(image.pokemonId, imageRows);
        }

        return rows.map((row) => mapRowToPokemon(row, imagesByPokemonId.get(row.id) ?? []));
    }
}

function mapRowToPokemon(row: InferSelectModel<typeof pokemonTable>, images: InferSelectModel<typeof pokemonImageTable>[] = []): Pokemon {
    return {
        id: row.id,
        name: row.name,
        baseExperience: row.baseExperience,
        height: row.height,
        weight: row.weight,
        profilePhoto: images.find((image) => image.isProfilePhoto)?.id ?? null,
        photos: images.map((image) => ({ id: image.id, url: image.url })),
    }
}

function mapPokemonToRow(pokemon: Pokemon): InferInsertModel<typeof pokemonTable> {
    return {
        id: pokemon.id,
        name: pokemon.name,
        baseExperience: pokemon.baseExperience,
        species: pokemon.name,
        height: pokemon.height,
        weight: pokemon.weight,
    }
}

function mapPokemonToImageRows(pokemon: Pokemon): InferInsertModel<typeof pokemonImageTable>[] {
    return pokemon.photos.map((photo) => ({
        pokemonId: pokemon.id,
        url: photo.url,
        isProfilePhoto: photo.id === pokemon.profilePhoto ? 1 : 0,
    }))
}