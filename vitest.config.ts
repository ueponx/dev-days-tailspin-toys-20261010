import { getViteConfig } from 'astro/config';
import { defineConfig } from 'vitest/config';

export default defineConfig(async (env) => {
    const astroViteConfig = await getViteConfig({})(env);
    return {
        ...astroViteConfig,
        test: {
            include: ['db/**/*.test.ts', 'src/**/*.test.ts'],
            environment: 'node',
        },
    };
});
