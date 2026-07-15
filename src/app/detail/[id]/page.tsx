import {redirect} from 'next/navigation';
import {pokemonService} from '@/lib/container';
import {PokemonCard} from '@/components/PokemonCard';
import {PokemonList} from '@/components/PokemonList';

export default async function PokemonDetailPage({ params }: { params: Promise<{id: string}> }) {
    const { id } = await params;
    const pokemon = await pokemonService.getById(Number(id));
    if (pokemon == null) {
        redirect('/');
    }
    const matches = await pokemonService.getMatches(pokemon);
    return (
        <div className="flex flex-col gap-4 p-8">
            <div className="flex gap-4">
                <div className="w-1/2">
                    <PokemonCard pokemon={pokemon}/>
                </div>
                <div className="w-1/2">
                    <PokemonList pokemon={matches}/>
                </div>
            </div>
        </div>
    )
}