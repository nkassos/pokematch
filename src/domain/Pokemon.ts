export interface Pokemon {
    id: number;
    name: string;
    baseExperience: number;
    height: number;
    weight: number;
    profilePhoto: number | null;
    photos: Array<PokemonPhoto>;
}

export interface PokemonPhoto {
    id: number;
    url: string;
}