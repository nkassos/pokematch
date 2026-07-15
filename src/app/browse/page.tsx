"use client";

import { useEffect, useState } from "react";
import { Pokemon } from "@/domain/Pokemon";
import { PokemonList } from "@/components/PokemonList";

const SEARCH_DEBOUNCE_MS = 400;
const PAGE_SIZE = 10;

interface BrowseResponse {
  results: Pokemon[];
  totalCount: number;
}

export default function Browse() {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<Pokemon[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [name, id]);

  useEffect(() => {
    setIsLoading(true);
    const trimmedName = name.trim();
    const trimmedId = id.trim();
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      const params = new URLSearchParams({ page: String(page) });
      if (trimmedName) {
        params.set("name", trimmedName);
      }
      if (trimmedId) {
        params.set("id", trimmedId);
      }

      fetch(`/api/browse?${params.toString()}`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data: BrowseResponse) => {
          setResults(data.results);
          setTotalCount(data.totalCount);
          setIsLoading(false);
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            setResults([]);
            setTotalCount(0);
            setIsLoading(false);
          }
        });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [name, id, page]);

  const pageCount = Math.max(Math.ceil(totalCount / PAGE_SIZE), 1);

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col gap-2 p-8">
        <div className="flex gap-2">
          <div className="flex flex-1 flex-col gap-2">
            <label
              htmlFor="browse-name"
              className="text-sm font-medium text-black dark:text-zinc-50"
            >
              Name
            </label>
            <input
              id="browse-name"
              name="browse-name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-md border border-zinc-300 px-3 py-2 text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
          </div>
          <div className="flex w-24 flex-col gap-2">
            <label
              htmlFor="browse-id"
              className="text-sm font-medium text-black dark:text-zinc-50"
            >
              ID
            </label>
            <input
              id="browse-id"
              name="browse-id"
              type="number"
              placeholder="ID"
              value={id}
              onChange={(event) => setId(event.target.value)}
              className="rounded-md border border-zinc-300 px-3 py-2 text-black [appearance:textfield] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        </div>
        <div className="relative">
          <PokemonList
            pokemon={results}
            pageSize={PAGE_SIZE}
            columns={2}
            pagination={{ page, pageCount, onPageChange: setPage }}
          />
          {isLoading && (
            <div
              role="status"
              aria-label="Loading"
              className="absolute inset-0 flex items-center justify-center bg-zinc-50/60 dark:bg-black/60"
            >
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-700 dark:border-t-zinc-300" />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
