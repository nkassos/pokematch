import { Pokemon } from "@/domain/Pokemon";
import { PokemonImage } from "@/components/PokemonImage";

export function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-lg border border-zinc-300 p-4 dark:border-zinc-700">
      <div className="relative h-24 w-24 shrink-0">
        {pokemon.profilePhoto ? (
          <PokemonImage
            src={pokemon.profilePhoto}
            alt={pokemon.name}
            sizes="96px"
            loading="eager"
          />
        ) : (
          <div className="h-full w-full rounded-md bg-zinc-200 dark:bg-zinc-800" />
        )}
      </div>
      <div className="flex flex-col items-start gap-1 text-black dark:text-zinc-50">
        <p className="text-lg font-semibold capitalize">{pokemon.name}</p>
        <p className="text-sm">ID: {pokemon.id}</p>
        <p className="text-sm">Base Experience: {pokemon.baseExperience}</p>
        <p className="text-sm">Height: {pokemon.height}</p>
        <p className="text-sm">Weight: {pokemon.weight}</p>
      </div>
    </div>
  );
}