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