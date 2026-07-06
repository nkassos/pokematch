"use client";

import { useRouter } from "next/navigation";
import { SubmitEvent, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [pokemonId, setPokemonId] = useState("");

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/detail/${pokemonId}`);
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-sm flex-col gap-2 p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <label
            htmlFor="pokemon-id"
            className="text-sm font-medium text-black dark:text-zinc-50"
          >
            Enter Pokemon ID
          </label>
          <input
            id="pokemon-id"
            name="pokemon-id"
            type="number"
            value={pokemonId}
            onChange={(event) => setPokemonId(event.target.value)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-black [appearance:textfield] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            type="submit"
            className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white dark:bg-zinc-50 dark:text-black"
          >
            Submit
          </button>
        </form>
      </main>
    </div>
  );
}