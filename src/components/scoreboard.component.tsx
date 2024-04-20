import React, { useState, useEffect, useRef } from 'react';
import { MatchService } from '../services/match.service';
import { MatchData } from '../helpers/match-data.interface';
import { Event } from '../helpers/event.interface'
import { Team } from '../helpers/team.interface';
import { Match } from '../helpers/match.interface';

export function Scoreboard() {
  const [matchData, setMatchData] = useState<MatchData>({ phase: '', teams: [], matches: [], events: [] });
  const matchService = new MatchService();
  const scoresRef = useRef<{ [key: number]: { home: number, away: number } }>({});
  const lastEventIdRef = useRef<number>(0);

  useEffect(() => {
    const interval: NodeJS.Timeout = setInterval(() => {
      matchService.getMatches()
        .then((data: MatchData) => {
          data.events.forEach((event: Event) => {
            if (event.event_id > lastEventIdRef.current && event.event_type === 'goal' && event.score_amount && event.score_team) {
              const match = data.matches.find((match: Match) => match.match_id === event.match_id);
              const homeTeam = data.teams.find((team: Team) => team.team_id === match?.home_team_id);
              const awayTeam = data.teams.find((team: Team) => team.team_id === match?.away_team_id);

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
          });

          setMatchData(data);
        })
        .catch((error) => {
          console.error('There was an error!', error);
        });
    }, 2000);

    return () => clearInterval(interval); 
  }, []);

  return (
    <div className="scoreboard">
      {matchData.matches.map((match: Match) => {

        const homeTeam = matchData.teams.find((team: Team) => team.team_id === match.home_team_id);
        const awayTeam = matchData.teams.find((team: Team) => team.team_id === match.away_team_id);

        // 'homeTeam' and 'awayTeam' is possibly 'undefined'
        if (!homeTeam || !awayTeam) return null;

        const scores = scoresRef.current[match.match_id] || { home: 0, away: 0 };

        return (
          <div key={match.match_id} className="match">
            <span>{homeTeam.team_name_short}</span>
            <span>{scores.home}:{scores.away}</span>
            <span>{awayTeam.team_name_short}</span>
          </div>
        );
      })}
    </div>
  );
};