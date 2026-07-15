import {int, sqliteTable, text} from "drizzle-orm/sqlite-core";

export const pokemonTable = sqliteTable("pokemon", {
    id: int().primaryKey({ autoIncrement: false }),
    name: text().notNull(),
    baseExperience: int("base_experience").notNull(),
    species: text().notNull(),
    height: int().notNull(),
    weight: int().notNull(),
    //profilePhoto: int().references(() => pokemonImageTable.id),
});

export const pokemonImageTable = sqliteTable("pokemon_images", {
    id: int().primaryKey({ autoIncrement: true }),
    pokemonId: int("pokemon_id").references(() => pokemonTable.id).notNull(),
    url: text().notNull(),
    isProfilePhoto: int("is_profile_photo").notNull().default(0),
});
