import React, { useState, useEffect } from 'react';
import { MatchService } from '../services/match.service';
import { MatchData } from '../helpers/match-data.interface';
import { Event } from '../helpers/event.interface'
import { Team } from '../helpers/team.interface';
import { Match } from '../helpers/match.interface';

const Scoreboard = () => {
  const [matchData, setMatchData] = useState<MatchData>({ phase: '', teams: [], matches: [], events: [] });
  const matchService = new MatchService();

  useEffect(() => {
    const interval: NodeJS.Timeout = setInterval(async () => {
      try {
        const data: MatchData = await matchService.getMatches();
        setMatchData(data);
      } catch (error) {
        console.error('There was an error!', error);
      }
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

        let homeScore = 0;
        let awayScore = 0;
        matchData.events.filter((event: Event) => event.match_id === match.match_id).forEach((event: Event) => {
          if (event.score_team === homeTeam.team_name && event.score_amount) homeScore += event.score_amount;
          if (event.score_team === awayTeam.team_name && event.score_amount) awayScore += event.score_amount;
        });

        return (
          <div key={match.match_id} className="match">
            <span>{homeTeam.team_name_short}</span>
            <span>{homeScore}:{awayScore}</span>
            <span>{awayTeam.team_name_short}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Scoreboard;