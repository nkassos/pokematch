"use client";

import { useEffect, useState } from "react";
import { Pokemon } from "@/domain/Pokemon";
import { PokemonList } from "@/components/PokemonList";

const SEARCH_DEBOUNCE_MS = 400;

interface SearchResponse {
  results: Pokemon[];
  totalCount: number;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Pokemon[]>([]);

  useEffect(() => {
    const trimmed = query.trim();
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      if (!trimmed) {
        setResults([]);
        return;
      }

      fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data: SearchResponse) => {
          setResults(data.results);
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            setResults([]);
          }
        });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-sm flex-col gap-2 p-8">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="pokemon-search"
            className="text-sm font-medium text-black dark:text-zinc-50"
          >
            Search Pokemon
          </label>
          <input
            id="pokemon-search"
            name="pokemon-search"
            type="text"
            placeholder="Name or ID"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
        </div>
        {results.length > 0 && <PokemonList pokemon={results} />}
      </main>
    </div>
  );
}
