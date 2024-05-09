// custom imports
import { MatchService } from '../services/match.service';
import { mockMatchData } from './mocks/match.service.mock';

let matchService: MatchService;

beforeEach(() => {
	matchService = MatchService.getInstance();
})

describe('MatchService', () => {
	describe('initialization', () => {
		it('should return the same instance when getInstance is called multiple times', () => {
			const anotherMatchService = MatchService.getInstance();

			expect(matchService).toBe(anotherMatchService);
		});
	});

	describe('getMatches', () => {
		it('should return some data', async () => {
			window.fetch = jest.fn().mockImplementationOnce(() => Promise.resolve({
				ok: true,
				status: 200,
				json: jest.fn().mockReturnValueOnce(mockMatchData)
			}));

			const matchService = MatchService.getInstance();

			expect(await matchService.getMatches()).toEqual(mockMatchData);
		});

		it('should throw an error when the server returns an HTTP error', async () => {
			window.fetch = jest.fn().mockImplementation(() => Promise.resolve({
				ok: false,
				status: 500
			}));

			const matchService = MatchService.getInstance();

			await expect(matchService.getMatches()).rejects.toThrow('HTTP error! status: 500');
		});
	});
});
