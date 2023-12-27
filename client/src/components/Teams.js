import React, { useState } from "react";
import { Button } from "react-bootstrap";
import "./app.css"; // Import a CSS file for custom styles
const NBATeams = ({setTeam}) => {
  const initialTeams = {
    Atlantic: [
      "Boston Celtics",
      "Brooklyn Nets",
      "New York Knicks",
      "Philadelphia 76ers",
      "Toronto Raptors",
    ],
    Central: [
      "Chicago Bulls",
      "Cleveland Cavaliers",
      "Detroit Pistons",
      "Indiana Pacers",
      "Milwaukee Bucks",
    ],
    Southeast: [
      "Atlanta Hawks",
      "Charlotte Hornets",
      "Miami Heat",
      "Orlando Magic",
      "Washington Wizards",
    ],
    Northwest: [
      "Denver Nuggets",
      "Minnesota Timberwolves",
      "Oklahoma City Thunder",
      "Portland Trail Blazers",
      "Utah Jazz",
    ],
    Pacific: [
      "Golden State Warriors",
      "LA Clippers",
      "Los Angeles Lakers",
      "Phoenix Suns",
      "Sacramento Kings",
    ],
    Southwest: [
      "Dallas Mavericks",
      "Houston Rockets",
      "Memphis Grizzlies",
      "New Orleans Pelicans",
      "San Antonio Spurs",
    ],
  };
  const nbaTeams = {
    "ATL": { abbreviation: "ATL", fullName: "Atlanta Hawks" },
    "BOS": { abbreviation: "BOS", fullName: "Boston Celtics" },
    "BKN": { abbreviation: "BKN", fullName: "Brooklyn Nets" },
    "CHA": { abbreviation: "CHA", fullName: "Charlotte Hornets" },
    "CHI": { abbreviation: "CHI", fullName: "Chicago Bulls" },
    "CLE": { abbreviation: "CLE", fullName: "Cleveland Cavaliers" },
    "DAL": { abbreviation: "DAL", fullName: "Dallas Mavericks" },
    "DEN": { abbreviation: "DEN", fullName: "Denver Nuggets" },
    "DET": { abbreviation: "DET", fullName: "Detroit Pistons" },
    "GS": { abbreviation: "GS", fullName: "Golden State Warriors" },
    "HOU": { abbreviation: "HOU", fullName: "Houston Rockets" },
    "IND": { abbreviation: "IND", fullName: "Indiana Pacers" },
    "LAC": { abbreviation: "LAC", fullName: "LA Clippers" },
    "LAL": { abbreviation: "LAL", fullName: "Los Angeles Lakers" },
    "MEM": { abbreviation: "MEM", fullName: "Memphis Grizzlies" },
    "MIA": { abbreviation: "MIA", fullName: "Miami Heat" },
    "MIL": { abbreviation: "MIL", fullName: "Milwaukee Bucks" },
    "MIN": { abbreviation: "MIN", fullName: "Minnesota Timberwolves" },
    "NOP": { abbreviation: "NOP", fullName: "New Orleans Pelicans" },
    "NYK": { abbreviation: "NYK", fullName: "New York Knicks" },
    "OKC": { abbreviation: "OKC", fullName: "Oklahoma City Thunder" },
    "ORL": { abbreviation: "ORL", fullName: "Orlando Magic" },
    "PHI": { abbreviation: "PHI", fullName: "Philadelphia 76ers" },
    "PHX": { abbreviation: "PHX", fullName: "Phoenix Suns" },
    "POR": { abbreviation: "POR", fullName: "Portland Trail Blazers" },
    "SAC": { abbreviation: "SAC", fullName: "Sacramento Kings" },
    "SAS": { abbreviation: "SAS", fullName: "San Antonio Spurs" },
    "TOR": { abbreviation: "TOR", fullName: "Toronto Raptors" },
    "UTAH": { abbreviation: "UTAH", fullName: "Utah Jazz" },
    "WAS": { abbreviation: "WAS", fullName: "Washington Wizards" }
  };
  

  const [teams, setTeams] = useState(initialTeams);

  const changeTeam = (division, teamName) => {
    const teamAbb = Object.values(nbaTeams).find(team => team.fullName.toLowerCase() === teamName.toLowerCase());
    setTeam(teamAbb.abbreviation);
    console.log(division, teamName);
  };

  return (
    <div>
      {Object.entries(teams).map(([division, teamList]) => (
        <div key={division} className='division'>
          <h2>{division}</h2>
          <ul>
            {teamList.map((team, index) => (
              <ol key={index}>
                <Button className="teamButton" onClick={() => changeTeam(division, team)}>
                  {" "}
                  {team}
                </Button>
              </ol>
            ))}
          </ul>
        </div>
      ))}
      
    </div>
  );
};

export default NBATeams;
