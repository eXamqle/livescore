import { MatchData } from '../helpers/match-data.interface'

const url = 'https://vgcommonstaging.aitcloud.de/livescore/'

export class MatchService {
	async getMatches(): Promise<MatchData> {
	  const response = await fetch(url);
	  if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	  }
	  return await response.json() as MatchData;
	}
  }