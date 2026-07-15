import { NextRequest, NextResponse } from "next/server";
import { pokemonService } from "@/lib/container";

const PAGE_SIZE = 10;

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const name = params.get("name")?.trim() || undefined;
  const idParam = params.get("id")?.trim() ?? "";
  const id = /^\d+$/.test(idParam) ? Number(idParam) : undefined;
  const page = Number(params.get("page") ?? "1") || 1;

  const { pokemon, totalCount } = await pokemonService.search({
    name,
    id,
    page,
    limit: PAGE_SIZE,
  });

  return NextResponse.json({ results: pokemon, totalCount });
}
