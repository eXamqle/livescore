import { render, act } from '@testing-library/react';

// custom imports
import { Scoreboard } from '../components/scoreboard.component';
import { MatchService } from '../services/match.service';

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

	jest.useFakeTimers();

	// it('fetches matches on mount', async () => {
	// 	const mockMatchService = MatchService as jest.Mocked<typeof MatchService>;
	// 	const mockData = {
	// 		"phase": "match",
	// 		"teams": [
	// 			{
	// 				"team_id": 8982001,
	// 				"team_name": "VL Lisbon",
	// 				"team_name_short": "LIS"
	// 			},
	// 			{
	// 				"team_id": 8982002,
	// 				"team_name": "VL London",
	// 				"team_name_short": "LON"
	// 			}],
	// 		"matches": [
	// 			{
	// 				"match_id": 251844951,
	// 				"tournament_id": 1782579,
	// 				"round": 22,
	// 				"home_team_id": 8982009,
	// 				"away_team_id": 8982008
	// 			},
	// 			{
	// 				"match_id": 251844952,
	// 				"tournament_id": 1782579,
	// 				"round": 22,
	// 				"home_team_id": 8982015,
	// 				"away_team_id": 8982001
	// 			}],
	// 		"events": [
	// 			{
	// 				"event_id": 1,
	// 				"event_type": "match_start",
	// 				"event_time": 0,
	// 				"match_id": 251844951
	// 			},
	// 			{
	// 				"event_id": 2,
	// 				"event_type": "match_start",
	// 				"event_time": 0,
	// 				"match_id": 251844952
	// 			}
	// 		]
	// 	};
	// 	mockMatchService.getInstance.mockReturnValue({
	// 		url: 'mock-url',
	// 		getMatches: jest.fn().mockResolvedValue(mockData),
	// 	});

	// 	await act(async () => {
	// 		render(<Scoreboard />);
	// 	});

	// 	jest.runAllTimers();

	// 	expect(mockMatchService.getInstance().getMatches).toHaveBeenCalled();
	// });
});
