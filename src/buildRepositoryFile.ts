import { config } from 'dotenv'
import {PokeApiClient} from '@/services/PokeApiClient';
import {buildCacheFromApi, writeCacheToFile} from '@/repository';

config();

(async () => {
    const apiClient = new PokeApiClient(process.env.POKEMON_API_URL!);
    const cache = await buildCacheFromApi(apiClient);
    await writeCacheToFile(process.env.CACHE_FILE!, cache);
})();