import React, { useState, useEffect, useRef } from 'react';
import { MatchService } from '../services/match.service';
import { MatchData } from '../helpers/match-data.interface';
import { Event } from '../helpers/event.interface'
import { Team } from '../helpers/team.interface';
import { Match } from '../helpers/match.interface';

export function Scoreboard() {
  // Import service
  const matchService = new MatchService();

  // Refs
  const scoresRef = useRef<{ [key: number]: { home: number, away: number } }>({});
  const matchStatusRef = useRef<{ [key: number]: { status: string } }>({});
  const lastEventIdRef = useRef<number>(0);

  // States
  const [matchData, setMatchData] = useState<MatchData>({ phase: '', teams: [], matches: [], events: [] });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [error, setError] = useState<string | null>(null);

  // Additional
  const isMobile = windowWidth < 1600;

  useEffect(() => {
    const interval: NodeJS.Timeout = setInterval(() => {
      matchService.getMatches()
        .then((data: MatchData) => {
          data.events.forEach((event: Event) => {
            const match = data.matches.find((match: Match) => match.match_id === event.match_id);
            const homeTeam = data.teams.find((team: Team) => team.team_id === match?.home_team_id);
            const awayTeam = data.teams.find((team: Team) => team.team_id === match?.away_team_id);

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

            if (match && !matchStatusRef.current[match.match_id]) {
              matchStatusRef.current[match.match_id] = { status: ''};
            }

            if (match && event.event_type == 'match_end') {
              matchStatusRef.current[match.match_id].status = 'match_end'
            }

          });

          setMatchData(data);
        })
        .catch((error) => {
          setError('There was an error while retrieving the data from the server')
        });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="scoreboard">
      {error && <div className="error">{error}</div>}
      {matchData.matches.map((match: Match) => {

        const homeTeamImgUrl = `${process.env.PUBLIC_URL}/images/logo_${match.home_team_id}.png`;
        const awayTeamImgUrl = `${process.env.PUBLIC_URL}/images/logo_${match.away_team_id}.png`;

        const homeTeam = matchData.teams.find((team: Team) => team.team_id === match.home_team_id);
        const awayTeam = matchData.teams.find((team: Team) => team.team_id === match.away_team_id);

        // 'homeTeam' and 'awayTeam' is possibly 'undefined'
        if (!homeTeam || !awayTeam) return null;

        const scores = scoresRef.current[match.match_id] || { home: 0, away: 0 };
        const matchStatus = matchStatusRef.current[match.match_id]?.status || '';

        return (
          <div key={match.match_id} className="match">
            <span className='home'>
              {isMobile ? homeTeam.team_name_short : homeTeam.team_name.replace('VL ', '')}
              <img className='home-flag' src={homeTeamImgUrl} alt="Home Team Flag" />
            </span>

            <span className={matchStatus === 'match_end' ? 'score' : 'score blink'}>
              {scores.home}:{scores.away}
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