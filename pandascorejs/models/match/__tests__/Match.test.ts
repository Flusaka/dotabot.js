import { describe, it, expect } from 'vitest';
import { Match } from '../Match';

describe('Match Schema', () => {
    it('should parse a valid match in snake_case', () => {
        const validMatch = {
            "begin_at": "2021-04-22T22:17:54Z",
            "detailed_stats": true,
            "draw": false,
            "end_at": "2021-04-23T01:30:43Z",
            "forfeit": false,
            "game_advantage": null,
            "games": [
                {
                "begin_at": "2021-04-22T22:17:55Z",
                "complete": true,
                "detailed_stats": true,
                "end_at": "2021-04-22T22:57:02Z",
                "finished": true,
                "forfeit": false,
                "id": 223851,
                "length": 1924,
                "match_id": 589643,
                "position": 1,
                "status": "finished",
                "winner": {
                    "id": 128785,
                    "type": "Team"
                },
                "winner_type": "Team"
                },
                {
                "begin_at": "2021-04-22T23:12:30Z",
                "complete": true,
                "detailed_stats": true,
                "end_at": "2021-04-22T23:47:04Z",
                "finished": true,
                "forfeit": false,
                "id": 223852,
                "length": 1600,
                "match_id": 589643,
                "position": 2,
                "status": "finished",
                "winner": {
                    "id": 1597,
                    "type": "Team"
                },
                "winner_type": "Team"
                },
                {
                "begin_at": "2021-04-23T00:03:07Z",
                "complete": true,
                "detailed_stats": true,
                "end_at": "2021-04-23T00:34:46Z",
                "finished": true,
                "forfeit": false,
                "id": 223853,
                "length": 1468,
                "match_id": 589643,
                "position": 3,
                "status": "finished",
                "winner": {
                    "id": 1597,
                    "type": "Team"
                },
                "winner_type": "Team"
                },
                {
                "begin_at": "2021-04-23T00:55:14Z",
                "complete": true,
                "detailed_stats": true,
                "end_at": "2021-04-23T01:30:44Z",
                "finished": true,
                "forfeit": false,
                "id": 223854,
                "length": 1671,
                "match_id": 589643,
                "position": 4,
                "status": "finished",
                "winner": {
                    "id": 1597,
                    "type": "Team"
                },
                "winner_type": "Team"
                }
            ],
            "id": 589643,
            "league": {
                "id": 4556,
                "image_url": "https://cdn.pandascore.co/images/league/image/4556/600px-LCS_Academy_League_2021.png",
                "modified_at": "2021-04-01T06:44:44Z",
                "name": "LCS Proving Grounds",
                "slug": "league-of-legends-lcs-proving-grounds",
                "url": null
            },
            "league_id": 4556,
            "live": {
                "opens_at": null,
                "supported": false,
                "url": null
            },
            "match_type": "best_of",
            "modified_at": "2021-04-23T01:58:35Z",
            "name": "Winners bracket round 5 match 1: C9.A vs NO",
            "number_of_games": 5,
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
            "original_scheduled_at": "2021-04-22T22:00:00Z",
            "rescheduled": false,
            "results": [
                {
                "score": 3,
                "team_id": 1597
                },
                {
                "score": 1,
                "team_id": 128785
                }
            ],
            "scheduled_at": "2021-04-22T22:00:00Z",
            "serie": {
                "begin_at": "2021-03-30T22:00:00Z",
                "end_at": "2021-04-26T04:00:00Z",
                "full_name": "Spring 2021",
                "id": 3489,
                "league_id": 4556,
                "modified_at": "2021-04-26T02:08:38Z",
                "name": null,
                "season": "Spring",
                "slug": "league-of-legends-lcs-proving-grounds-spring-2021",
                "winner_id": 128785,
                "winner_type": "Team",
                "year": 2021
            },
            "serie_id": 3489,
            "slug": "cloud9-academy-2021-04-23",
            "status": "finished",
            "streams_list": [
                {
                "embed_url": "https://player.twitch.tv/?channel=academy",
                "language": "en",
                "main": true,
                "official": true,
                "raw_url": "https://www.twitch.tv/academy"
                }
            ],
            "tournament": {
                "begin_at": "2021-03-30T22:00:00Z",
                "country": null,
                "detailed_stats": true,
                "end_at": "2021-04-26T04:00:00Z",
                "has_bracket": true,
                "id": 5810,
                "league_id": 4556,
                "live_supported": false,
                "modified_at": "2022-08-08T14:20:46Z",
                "name": "Regular Season",
                "prizepool": null,
                "region": null,
                "serie_id": 3489,
                "slug": "league-of-legends-lcs-proving-grounds-spring-2021-regular",
                "tier": "d",
                "type": null,
                "winner_id": 128785,
                "winner_type": "Team"
            },
            "tournament_id": 5810,
            "videogame": {
                "id": 1,
                "name": "LoL",
                "slug": "league-of-legends"
            },
            "videogame_title": null,
            "videogame_version": {
                "current": false,
                "name": "11.6.1"
            },
            "winner": {
                "acronym": "C9.A",
                "dark_mode_image_url": null,
                "id": 1597,
                "image_url": "https://cdn.pandascore.co/images/team/image/1597/cloud9-academy-a874mk5a.png",
                "location": "US",
                "modified_at": "2023-03-07T15:37:14Z",
                "name": "Cloud9 Academy",
                "slug": "cloud9-academy"
            },
            "winner_id": 1597,
            "winner_type": "Team"
        };

        const parsedMatch = Match.parse(validMatch);
        expect(parsedMatch).toBeDefined();
        expect(parsedMatch.id).toBe(589643);
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