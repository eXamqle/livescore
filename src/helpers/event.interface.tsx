export type EventType = 'match_start' | 'goal' | 'match_halftime' | 'match_end';

export interface Event {
	event_id: number;
	event_type: EventType;
	event_time: number;
	match_id: number;
	score_amount?: number;
	score_team?: string;
  }