import React from 'react';
import { render } from '@testing-library/react';

// custom imports
import { MatchService } from './services/match.service';
import { Scoreboard } from '../src/components/scoreboard.component';

test('renders without crashing', () => {
	render(<Scoreboard />);
});

describe('MatchService', () => {
	it('fetches match data from the server', async () => {
		const service = new MatchService();
		const data = await service.getMatches();
		expect(data).toBeDefined();
	});
});