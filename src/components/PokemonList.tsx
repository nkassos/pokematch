"use client";

import { useState } from "react";
import Link from "next/link";
import { Pokemon } from "@/domain/Pokemon";
import { PokemonImage } from "@/components/PokemonImage";

const DEFAULT_PAGE_SIZE = 5;
const MAX_NAME_LENGTH = 18;

function truncateName(name: string): string {
  return name.length > MAX_NAME_LENGTH ? `${name.slice(0, MAX_NAME_LENGTH)}…` : name;
}

interface ControlledPagination {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export function PokemonList({
  pokemon,
  pagination,
  pageSize = DEFAULT_PAGE_SIZE,
  columns = 1,
}: {
  pokemon: Pokemon[];
  pagination?: ControlledPagination;
  pageSize?: number;
  columns?: number;
}) {
  const [internalPage, setInternalPage] = useState(0);

  const pagePokemon = pagination
    ? pokemon
    : pokemon.slice(internalPage * pageSize, internalPage * pageSize + pageSize);

  const currentPage = pagination ? pagination.page : internalPage + 1;
  const pageCount = pagination ? pagination.pageCount : Math.ceil(pokemon.length / pageSize);
  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < pageCount;
  const showPagination = pageCount > 1;

  function goToPage(nextPage: number) {
    if (pagination) {
      pagination.onPageChange(nextPage);
    } else {
      setInternalPage(nextPage - 1);
    }
  }

  const rowsPerColumn = Math.ceil(pageSize / columns);
  const columnChunks = Array.from({ length: columns }, (_, columnIndex) =>
    pagePokemon.slice(columnIndex * rowsPerColumn, (columnIndex + 1) * rowsPerColumn)
  );

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full gap-2">
        {columnChunks.map((columnPokemon, columnIndex) => (
          <ul key={columnIndex} className="flex w-full flex-1 flex-col gap-2">
            {columnPokemon.map((p) => {
              const profilePhotoUrl = p.photos.find((photo) => photo.id === p.profilePhoto)?.url;
              return (
                <li key={p.id}>
                  <Link
                    href={`/detail/${p.id}`}
                    className="flex gap-4 rounded-lg border border-zinc-300 p-4 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
                  >
                    <div className="relative h-16 w-16 shrink-0">
                      {profilePhotoUrl ? (
                        <PokemonImage src={profilePhotoUrl} alt={p.name} sizes="64px" />
                      ) : (
                        <div className="h-full w-full rounded-md bg-zinc-200 dark:bg-zinc-800" />
                      )}
                    </div>
                    <div className="flex flex-col justify-center gap-1 text-black dark:text-zinc-50">
                      <p className="text-base font-semibold capitalize">{truncateName(p.name)}</p>
                      <p className="text-sm">Height: {p.height}</p>
                      <p className="text-sm">Weight: {p.weight}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
            {Array.from({ length: rowsPerColumn - columnPokemon.length }).map((_, index) => (
              <li key={`placeholder-${index}`} aria-hidden className="invisible">
                <div className="flex gap-4 rounded-lg border border-transparent p-4">
                  <div className="h-16 w-16 shrink-0" />
                  <div className="flex flex-col justify-center gap-1">
                    <p className="text-base font-semibold">&nbsp;</p>
                    <p className="text-sm">&nbsp;</p>
                    <p className="text-sm">&nbsp;</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ))}
      </div>
      {showPagination && (
        <div className="flex items-center justify-between text-black dark:text-zinc-50">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={!hasPrevPage}
            className="rounded-md border border-zinc-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-zinc-700"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {currentPage} of {pageCount}
          </span>
          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={!hasNextPage}
            className="rounded-md border border-zinc-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-zinc-700"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}