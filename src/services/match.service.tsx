import { MatchData } from "../helpers/match-data.interface";

export class MatchService {
	private static instance: MatchService;
	private url = 'https://vgcommonstaging.aitcloud.de/livescore/';

	private constructor() { }

	public static getInstance(): MatchService {
		if (!MatchService.instance) {
			MatchService.instance = new MatchService();
		}

		return MatchService.instance;
	}

	public getMatches(): Promise<MatchData> {
		return fetch(this.url)
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then(data => {
				return data as MatchData;
			});
	}
}