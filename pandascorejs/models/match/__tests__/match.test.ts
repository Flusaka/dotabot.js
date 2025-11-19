import { describe, it, expect } from 'vitest';
import { Match } from '../match';

describe('Match Schema', () => {
    it('should parse a valid match in snake_case', () => {
        const validMatch = {
            begin_at: '2018-09-05T08:44:19Z',
            detailed_stats: true,
            draw: false,
            end_at: '2018-09-05T12:09:04Z',
            forfeit: false,
            game_advantage: null,
            id: 53989,
            league: {
                id: 4556,
                image_url: "https://cdn.pandascore.co/images/league/image/4556/600px-LCS_Academy_League_2021.png",
                modified_at: "2021-04-01T06:44:44Z",
                name: "LCS Proving Grounds",
                slug: "league-of-legends-lcs-proving-grounds",
                url: null
            },
            match_type: 'best_of',
            modified_at: '2021-09-10T15:48:08Z',
            name: 'SN vs TES',
            number_of_games: 5,
            "opponents": [
                {
                    "opponent": {
                        "acronym": "C9.A",
                        "dark_mode_image_url": null,
                        "id": 1597,
                        "image_url": "https://cdn.pandascore.co/images/team/image/1597/cloud9-academy-a874mk5a.png",
                        "location": "US",
                        "modified_at": "2023-03-07T15:37:14Z",
                        "name": "Cloud9 Academy",
                        "slug": "cloud9-academy"
                    },
                    "type": "Team"
                },
                {
                    "opponent": {
                        "acronym": "NO",
                        "dark_mode_image_url": null,
                        "id": 128785,
                        "image_url": "https://cdn.pandascore.co/images/team/image/128785/no_orglogo_square.png",
                        "location": "US",
                        "modified_at": "2021-12-06T12:28:48Z",
                        "name": "No Org",
                        "slug": "no-org"
                    },
                    "type": "Team"
                }
            ],
            original_scheduled_at: '2018-09-05T08:44:19Z',
            rescheduled: false,
            scheduled_at: '2018-09-05T08:00:00Z',
            slug: 'suning-vs-topsports-gaming-2018-09-05',
            status: 'finished',
            tournament_id: 1590,
        };

        const parsedMatch = Match.parse(validMatch);
        expect(parsedMatch).toBeDefined();
        expect(parsedMatch.id).toBe(53989);
        expect(parsedMatch.matchType).toBe('best_of');
    });

    it('should throw for an invalid match', () => {
        const invalidMatch = {
            id: 'not_a_number', // Invalid: should be a number
            match_type: 'invalid_type',
        };

        expect(() => Match.parse(invalidMatch)).toThrow();
    });
});