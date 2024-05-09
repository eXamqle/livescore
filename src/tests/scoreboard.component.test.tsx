import { render, act, screen, waitFor } from '@testing-library/react';

// custom imports
import { Scoreboard } from '../components/scoreboard.component';
import { MatchService } from '../services/match.service';
import { mockScoreboardMatchData } from './mocks/scoreboard.component.mock';
import { mockMatchData } from './mocks/match.service.mock';

// moch match servuce
jest.mock('../services/match.service');

describe('Scoreboard', () => {
	it('should render the scoreboard', () => {
		render(<Scoreboard />);
	});

	it('should update windowWidth on window resize', () => {
		const { rerender, getByTestId } = render(<Scoreboard />);
		expect(getByTestId('scoreboard-width-1024')).toBeDefined();

		act(() => {
			global.innerWidth = 500;
			global.dispatchEvent(new Event('resize'));
		});

		rerender(<Scoreboard />);
		expect(getByTestId('scoreboard-width-500')).toBeDefined();
	});

	it('should display team name when match data is provided', async () => {
		(MatchService.getInstance as jest.Mock).mockReturnValue({
			url: 'mock-url',
			getMatches: jest.fn().mockResolvedValue(mockScoreboardMatchData),
		});
		render(<Scoreboard />);

		await waitFor(() => {
			expect(screen.getByTitle('VL Lisbon"')).toBeInTheDocument();
		});
	});

	it('should display match scores when match data is provided', async () => {
		(MatchService.getInstance as jest.Mock).mockReturnValue({
			getMatches: jest.fn().mockResolvedValue(mockScoreboardMatchData),
		});

		render(<Scoreboard />);

		await waitFor(() => {
			expect(screen.getByText('1:1')).toBeInTheDocument();
		});
	});

	it('updates match scores when match data changes', async () => {
		(MatchService.getInstance as jest.Mock).mockReturnValue({
			getMatches: jest.fn().mockResolvedValue({
				phase: 'match',
				teams: [
					{ team_id: 1, team_name: 'Team 1', team_name_short: 'T1' },
					{ team_id: 2, team_name: 'Team 2', team_name_short: 'T2' },
				],
				matches: [
					{ match_id: 1, home_team_id: 1, away_team_id: 2 },
				],
				events: [
					{ match_id: 1, event_type: 'goal', score_team: 'home', score_amount: 1 },
				],
			}),
		});

		const { rerender, getByText } = render(<Scoreboard />);
		await waitFor(() => {
			expect(screen.getByText((content, node) => {
				const hasText = (node: any) => node.textContent === '1:0';

				if (node) {
					return Array.from(node.children).some(hasText);
				}
				return false;
			})).toBeInTheDocument();
		});

		(MatchService.getInstance as jest.Mock).mockReturnValue({
			getMatches: jest.fn().mockResolvedValue({
				phase: 'match',
				teams: [
					{ team_id: 1, team_name: 'Team 1', team_name_short: 'T1' },
					{ team_id: 2, team_name: 'Team 2', team_name_short: 'T2' },
				],
				matches: [
					{ match_id: 1, home_team_id: 1, away_team_id: 2 },
				],
				events: [
					{ match_id: 1, event_type: 'goal', score_team: 'home', score_amount: 1 },
					{ match_id: 1, event_type: 'goal', score_team: 'away', score_amount: 2 },
				],
			}),
		});

		rerender(<Scoreboard />);
		await waitFor(() => {
			expect(getByText('1:2')).toBeInTheDocument();
		});
	});

	jest.useFakeTimers();
	it('should fetch matches on mount', async () => {
		const mockMatchService = MatchService as jest.Mocked<typeof MatchService>;
		mockMatchService.getInstance.mockReturnValue({
			url: 'mock-url',
			getMatches: jest.fn().mockResolvedValue(mockMatchData),
		});

		await act(async () => {
			render(<Scoreboard />);

			jest.advanceTimersByTime(2001)

			await waitFor(() => {
				expect(mockMatchService.getInstance().getMatches).toHaveBeenCalled();
			});
		});

		// clean up timers
		jest.useRealTimers();
	});
});
