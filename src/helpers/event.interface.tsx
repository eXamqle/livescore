export interface Event {
	event_id: number;
	event_type: string;
	event_time: number;
	match_id: number;
	score_amount?: number;
	score_team?: string;
  }