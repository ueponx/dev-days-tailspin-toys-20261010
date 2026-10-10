import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import type { Game } from '../types/game';
import GameCard from './GameCard.astro';

async function renderGameCard(starRating: number | null): Promise<string> {
    const container = await AstroContainer.create();
    const game: Game = {
        id: 42,
        title: 'Rating Test Game',
        description: 'Game card rating render test',
        publisher: { id: 1, name: 'Tailspin Studio' },
        category: { id: 1, name: 'Adventure' },
        starRating,
    };

    return container.renderToString(GameCard, { props: { game } });
}

describe('GameCard', () => {
    it.each([
        { rating: 4.2, expectedNumericText: '4.2', expectedStars: '★★★★☆' },
        { rating: 0, expectedNumericText: '0.0', expectedStars: '☆☆☆☆☆' },
        { rating: 5, expectedNumericText: '5.0', expectedStars: '★★★★★' },
    ])('renders star rating for $rating and hides unrated text', async ({ rating, expectedNumericText, expectedStars }) => {
        const markup = await renderGameCard(rating);

        expect(markup).toContain('data-testid="game-rating"');
        expect(markup).toContain(expectedStars);
        expect(markup).toContain(expectedNumericText);
        expect(markup).toContain('data-testid="game-card-rating"');
        expect(markup).not.toContain('data-testid="game-rating-unrated"');
        expect(markup).not.toContain('No rating yet');
    });

    it('renders No rating yet for null and hides star rating output', async () => {
        const markup = await renderGameCard(null);

        expect(markup).toContain('No rating yet');
        expect(markup).toContain('data-testid="game-card-rating"');
        expect(markup).toContain('data-testid="game-rating-unrated"');
        expect(markup).not.toContain('data-testid="game-rating"');
        expect(markup).not.toContain('0.0');
        expect(markup).not.toContain('4.2');
        expect(markup).not.toContain('5.0');
    });

    it('preserves game details link structure', async () => {
        const markup = await renderGameCard(4.2);

        expect(markup).toMatch(/<a[^>]*href="\/game\/42"[^>]*data-testid="game-card"[^>]*>/);
        expect(markup.match(/<a\b/g)?.length).toBe(1);
        expect(markup).toContain('data-testid="game-title"');
        expect(markup).toContain('View details');
    });
});
