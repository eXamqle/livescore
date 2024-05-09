import { isParenthesizedTypeNode } from "typescript";
import { MatchData } from "../../helpers/match-data.interface";

export const mockMatchData: MatchData[] = [{
	phase: 'post_match',
	teams: [{
		team_id: 8982001,
		team_name: "VL Lisbon",
		team_name_short: "LIS"
	},
	{
		team_id: 8982002,
		team_name: "VL London",
		team_name_short: "LON"
	}],
	matches: [],
	events: []
}]

export const mockMatchDataResponse = 
{
	ok: true,
	status: 200,
	data: mockMatchData
}
