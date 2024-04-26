import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MatchService } from '../services/match.service';
import { MatchData } from '../helpers/match-data.interface';
import { Event } from '../helpers/event.interface'
import { Team } from '../helpers/team.interface';
import { Match } from '../helpers/match.interface';

export function Scoreboard() {
	// Import match service as a singleton
	const matchService = MatchService.getInstance();

	// Refs
	const scoresRef = useRef<{ [key: number]: { home: number, away: number } }>({});
	const lastEventIdRef = useRef<number>(0);

	// States
	const [matchData, setMatchData] = useState<MatchData>({ phase: 'pre_match', teams: [], matches: [], events: [] });
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [error, setError] = useState<string | null>(null);

	// Additional
	const isMobile = windowWidth < 1600; // TODO: Add more breakpoints

	// Divide to function to fetch matches
	const fetchMatches = useCallback(() => {
		matchService.getMatches()
			.then((data: MatchData) => {
				data.events.forEach((event: Event) => {
					const match = data.matches.find((match: Match) => match.match_id === event.match_id);
					const homeTeam = data.teams.find((team: Team) => team.team_id === match?.home_team_id);
					const awayTeam = data.teams.find((team: Team) => team.team_id === match?.away_team_id);

					updateScores(event, match, homeTeam, awayTeam);
				});

				setMatchData(data);
			})
			.catch((error) => {
				setError(error.toString())
			});
	}, [matchService]);

	// and a function to update scores because of single responsibility principle
	const updateScores = (event: Event, match: Match | undefined, homeTeam: Team | undefined, awayTeam: Team | undefined) => {
		if (event.event_id > lastEventIdRef.current && event.event_type === 'goal' && event.score_amount && event.score_team) {
			if (match && homeTeam && awayTeam) {
				if (!scoresRef.current[match.match_id]) {
					scoresRef.current[match.match_id] = { home: 0, away: 0 };
				}

				if (event.score_team === 'home') {
					scoresRef.current[match.match_id].home += event.score_amount;
				} else if (event.score_team === 'away') {
					scoresRef.current[match.match_id].away += event.score_amount;
				}

				lastEventIdRef.current = event.event_id;
			}
		}
	}

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
		<div className="scoreboard">
			{error && <div className="error">{error}</div>}
			{matchData.matches.map((match: Match) => {

				const homeTeamImgUrl = `${process.env.PUBLIC_URL}/images/logo_${match.home_team_id}.png`;
				const awayTeamImgUrl = `${process.env.PUBLIC_URL}/images/logo_${match.away_team_id}.png`;

				const homeTeam = matchData.teams.find((team: Team) => team.team_id === match.home_team_id);
				const awayTeam = matchData.teams.find((team: Team) => team.team_id === match.away_team_id);

				const scores = scoresRef.current[match.match_id] || { home: 0, away: 0 };

				const isPreMatch = matchData.phase === 'pre_match';
				const isMatch = matchData.phase === 'match';

				const className = isMatch ? 'score blink' : 'score';
				const backgroundColor = isPreMatch ? '#f9f9f9' : '#01a5e2';
				const scoreText = isPreMatch ? '' : `${scores.home}:${scores.away}`;

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