import { Team } from '../helpers/team.interface'
import { Match } from '../helpers/match.interface'
import { Event } from '../helpers/event.interface'

export type phaseType = 'pre_match' | 'match' | 'post_match'

export interface MatchData {
	phase: phaseType;
	teams: Team[];
	matches: Match[];
	events: Event[];
  }