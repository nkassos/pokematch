export interface Pokemon {
    id: number;
    name: string;
    baseExperience: number;
    height: number;
    weight: number;
    profilePhoto: string | null;
    additionalPhotos: Array<string>;
}