import { NextRequest, NextResponse } from "next/server";
import { pokemonService } from "@/lib/container";

const PAGE_SIZE = 5;

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const page = Number(request.nextUrl.searchParams.get("page") ?? "1") || 1;

  if (!query) {
    return NextResponse.json({ results: [], totalCount: 0 });
  }

  const { pokemon, totalCount } = /^\d+$/.test(query)
    ? await pokemonService.search({ id: Number(query) })
    : await pokemonService.search({ name: query, page, limit: PAGE_SIZE });

  return NextResponse.json({ results: pokemon, totalCount });
}