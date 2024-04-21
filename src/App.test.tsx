import React from 'react';
import { render, screen } from '@testing-library/react';

// custom imports
import { MatchService } from './services/match.service';
import { Scoreboard } from '../src/components/scoreboard.component';

describe('MatchService', () => {
	it('fetches match data from the server', async () => {
		const service = new MatchService();
		const data = await service.getMatches();
		expect(data).toBeDefined();
	});
});

it('renders error message when there is an error', () => {
	MatchService.prototype.getMatches = jest.fn(() => Promise.reject(new Error('Test error')));

	render(<Scoreboard />);

	setTimeout(() => {
		expect(screen.getByText('There was an error while retrieving the data from the server')).toBeInTheDocument();
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

	setTimeout(() => {
		expect(screen.getByText('Test Team 1')).toBeInTheDocument();
	}, 2000);
});