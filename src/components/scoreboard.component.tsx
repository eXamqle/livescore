import React, { useState, useEffect, useCallback } from 'react';
import { MatchService } from '../services/match.service';
import { MatchData } from '../helpers/match-data.interface';
import { Event } from '../helpers/event.interface'
import { Team } from '../helpers/team.interface';
import { Match } from '../helpers/match.interface';

export function Scoreboard() {
	// Import match service as a singleton
	const matchService = MatchService.getInstance();

	// States
	const [matchData, setMatchData] = useState<MatchData>({ phase: 'pre_match', teams: [], matches: [], events: [] });
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [error, setError] = useState<string | null>(null);
	const [scores, setScores] = useState<{ [key: number]: { home: number, away: number } }>({});

	// Additional
	const isMobile = windowWidth < 1600; // TODO: Add more breakpoints

	// Divide to function to fetch matches
	const fetchMatches = useCallback(() => {
		matchService.getMatches()
			.then((data: MatchData) => {
				const newScores: { [key: number]: { home: number, away: number } } = {};
				data.events.forEach((event: Event) => {
					if (event.event_type === 'goal' && (event.score_team === 'home' || event.score_team === 'away') && event.score_amount) {
						if (!newScores[event.match_id]) {
							newScores[event.match_id] = { home: 0, away: 0 };
						}
						newScores[event.match_id][event.score_team] += event.score_amount;
					}
				});
				setMatchData(data);
				setScores(newScores);
			})
			.catch((error) => {
				setError(error.toString())
			});
	}, [matchService]);

	// https://react.dev/learn/synchronizing-with-effects#you-might-not-need-an-effect
	useEffect(() => {
		const interval: NodeJS.Timeout = setInterval(fetchMatches, 2000);
		return () => clearInterval(interval);
	}, [fetchMatches]);

	useEffect(() => {
		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize); // <-- Preventing memory leaks and unnecessary operations
	}, []);

	return (
		<div className="scoreboard" data-testid={`scoreboard-width-${windowWidth}`}>
			{error && <div className="error">{error}</div>}
			{matchData.matches.map((match: Match) => {

				const homeTeamImgUrl = `${process.env.PUBLIC_URL}/images/logo_${match.home_team_id}.png`;
				const awayTeamImgUrl = `${process.env.PUBLIC_URL}/images/logo_${match.away_team_id}.png`;

				const homeTeam = matchData.teams.find((team: Team) => team.team_id === match.home_team_id);
				const awayTeam = matchData.teams.find((team: Team) => team.team_id === match.away_team_id);

				const matchScores = scores[match.match_id] || { home: 0, away: 0 };

				const isPreMatch = matchData.phase === 'pre_match';
				const isMatch = matchData.phase === 'match';

				const className = isMatch ? 'score blink' : 'score';
				const backgroundColor = isPreMatch ? '#f9f9f9' : '#01a5e2';
				const scoreText = isPreMatch ? '' : `${matchScores.home}:${matchScores.away}`;

				// 'homeTeam' and 'awayTeam' is possibly 'undefined'
				if (!homeTeam || !awayTeam) return null;
				return (
					<div key={match.match_id} className="match">
						<span className='home'>
							{isMobile ? homeTeam.team_name_short : homeTeam.team_name.replace('VL ', '')}
							<img className='home-flag' src={homeTeamImgUrl} alt="Home Team Flag" />
						</span>

						<span className={className} style={{ backgroundColor }}>
							{scoreText}
						</span>

						<span className='away'>
							<img className='away-flag' src={awayTeamImgUrl} alt="Away Team Flag" />
							{isMobile ? awayTeam.team_name_short : awayTeam.team_name.replace('VL ', '')}
						</span>
					</div>
				);
			})}
		</div>
	);
};