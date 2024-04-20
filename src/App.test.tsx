import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// custom imports
import { MatchService } from './services/match.service';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

describe('MatchService', () => {
	it('fetches match data from the server', async () => {
	  const service = new MatchService();
	  const data = await service.getMatches();
	  expect(data).toBeDefined();
	});
  });