import { Team } from '../helpers/team.interface'
import { Match } from '../helpers/match.interface'
import { Event } from '../helpers/event.interface'

export interface MatchData {
	phase: string;
	teams: Team[];
	matches: Match[];
	events: Event[];
  }