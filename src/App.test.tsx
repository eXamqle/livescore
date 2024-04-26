import React from 'react';
import { render, screen } from '@testing-library/react';

// custom imports
import { MatchService } from './services/match.service';
import { Scoreboard } from '../src/components/scoreboard.component';

describe('MatchService', () => {
	it('throws an error when the server returns an HTTP error', async () => {
		window.fetch = jest.fn().mockImplementation(() => Promise.resolve({
			ok: false,
			status: 500
		}));

		const matchService = MatchService.getInstance();

		await expect(matchService.getMatches()).rejects.toThrow('HTTP error! status: 500');
	});

	it('throws an error when the server returns invalid match data', async () => {
		window.fetch = jest.fn().mockImplementation(() => Promise.resolve({
			ok: true,
			json: () => Promise.resolve({ teams: 'invalid data' })
		}));

		const matchService = MatchService.getInstance();

		await expect(matchService.getMatches()).rejects.toThrow('Invalid match data');
	});

	it('returns the same instance when getInstance is called multiple times', () => {
		const instance1 = MatchService.getInstance();
		const instance2 = MatchService.getInstance();

		expect(instance1).toBe(instance2);
	});
});

it('renders error message when there is an error', () => {
	MatchService.prototype.getMatches = jest.fn(() => Promise.reject(new Error('HTTP error! status: 200')));

	render(<Scoreboard />);

	setTimeout(() => {
		expect(screen.getByText('HTTP error! status: 200')).toBeInTheDocument();
	}, 2000);
});

it('renders matches when matchData has data', () => {
	MatchService.prototype.getMatches = jest.fn(() => Promise.resolve({
		"phase": "match",
		"teams": [
			{
				"team_id": 8982001,
				"team_name": "VL Lisbon",
				"team_name_short": "LIS"
			}
		],
		"matches": [
			{
				"match_id": 251071404,
				"tournament_id": 1775490,
				"round": 18,
				"home_team_id": 8982008,
				"away_team_id": 8982001
			}
		],
		"events": []
	}));

	render(<Scoreboard />);
});

afterEach(() => {
	jest.resetAllMocks();
});