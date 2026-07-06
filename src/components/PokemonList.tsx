import Link from "next/link";
import { Pokemon } from "@/domain/Pokemon";
import { PokemonImage } from "@/components/PokemonImage";

export function PokemonList({ pokemon }: { pokemon: Pokemon[] }) {
  return (
    <ul className="flex max-h-[270px] w-full flex-col gap-2 overflow-y-auto">
      {pokemon.map((p) => (
        <li key={p.id}>
          <Link
            href={`/detail/${p.id}`}
            className="flex gap-4 rounded-lg border border-zinc-300 p-4 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            <div className="relative h-16 w-16 shrink-0">
              {p.profilePhoto ? (
                <PokemonImage src={p.profilePhoto} alt={p.name} sizes="64px" />
              ) : (
                <div className="h-full w-full rounded-md bg-zinc-200 dark:bg-zinc-800" />
              )}
            </div>
            <div className="flex flex-col justify-center gap-1 text-black dark:text-zinc-50">
              <p className="text-base font-semibold capitalize">{p.name}</p>
              <p className="text-sm">Height: {p.height}</p>
              <p className="text-sm">Weight: {p.weight}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}