import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Button, Container, Stack } from "react-bootstrap";
import PlayerCard from "../components/PlayerCard";
import Chart from "../components/Chart";
import Teams from "../components/Teams";
import { QUERY_TEAM_PLAYERS,GET_ODDS } from "../utils/queries";

const Stats = () => {
  const [team, setTeam] = useState("");
  const [player, setPlayer] = useState({});
  const [playerName, setPlayerName] = useState("");
  const { loading, error, data, refetch } = useQuery(QUERY_TEAM_PLAYERS, {
    variables: { team: "" },
  });
  const { data: oddsData } = useQuery(GET_ODDS);
  useEffect(() => {
    refetch({ team: team });
  }, [team]);
  const handlePlayerSelect = (player) => {
    setPlayer(player);
    setPlayerName(player.name);
  };

  const renderPlayerButtons = () => {
    if (!data || !data.teamPlayers || !data.teamPlayers.length) {
      return null;
    }
    const teamPlayers = data.teamPlayers;
    // alphabetize players by name
    const sortedPlayers =[]
    for (let i = 0; i < teamPlayers.length; i++) {
      sortedPlayers.push(teamPlayers[i])
    }
    sortedPlayers.sort((a, b) => {
      if (a.name < b.name) {
        return -1
      }
      if (a.name > b.name) {
        return 1
      }
      return 0
    })
    

    // Chunk players into arrays with 3 players each
    const chunkedPlayers = [];
    for (let i = 0; i < sortedPlayers.length; i += 3) {
      chunkedPlayers.push(sortedPlayers.slice(i, i + 3));
    }

    return chunkedPlayers.map((row, index) => (
      <div className="buttonRow" key={index}>
        {row.map((player) => (
          <div key={player.name}>
            <Button
              className="selectButton"
              onClick={() => handlePlayerSelect(player)}
            >
              {player.name}
            </Button>
          </div>
        ))}
      </div>
    ));
  };
  return (
    <div>
      {team === "" ? (
        <div>
          <h1>Choose a team</h1>
          <Teams setTeam={setTeam} />
        </div>
      ) : (
        <>
          <div className="buttonGrid">{renderPlayerButtons()}</div>
          <span style={{ display: "flex", justifyContent: "center" }}>
            <h1>{playerName}</h1>
          </span>
          <Container
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
            key={playerName}
          >
            {/* stack sideways */}
            <Stack direction="horizontal">
              {playerName !== "" && (
                <>
                  <Stack
                    direction="horizontal"
                    spacing={2}
                    sx={{
                      maxWidth: "100%",
                      "@media (max-width: 600px)": {
                        flexDirection: "column",
                      },
                    }}
                  >
                    <PlayerCard player={player} odds={oddsData} team = {team}/>
                    <Chart playerName={player.name} data={data} />
                  </Stack>
                </>
              )}
            </Stack>
          </Container>
        </>
      )}
    </div>
  );
};

export default Stats;
