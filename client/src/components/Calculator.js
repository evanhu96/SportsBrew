import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Button, Container, Dropdown, Form } from "react-bootstrap";
import { QUERY_TEAM_PLAYERS,QUERY_PROP_CALC } from "../utils/queries";

const YourComponent = ({ team }) => {
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [selectedProp, setSelectedProp] = useState("");
  const [amount, setAmount] = useState(0);
  const [playerData, setPlayerData] = useState([]);
  const [calculate, setCalculate] = useState(false);
  const { loading, error, data, refetch } = useQuery(QUERY_TEAM_PLAYERS, {
    variables: { team: "" },
  });
  const { loading: loading2, error: error2, data: data2 } = useQuery(QUERY_PROP_CALC, {
    variables: { inputs: playerData, team: team },
    skip: !calculate,
  });

  useEffect(() => {
    refetch({ team: team });
  }, [team]);

  const players = data?.teamPlayers.map((player) => player.name);
  const properties = [
    "MIN",
    "PTS",
    "AST",
    "DREB",
    "OREB",
    "REB",
    "FGA",
    "FGM",
    "3PTA",
    "3PTM",
    "FTA",
    "FTM",
    "+/-",
    "BLK",
    "TO",
    "PF",
    "STL",
  ];
  const handlePlayerChange = (player) => {
    setSelectedPlayer(player);
  };

  const handlePropChange = (prop) => {
    setSelectedProp(prop);
  };

  const handleAmountChange = (e) => {
    setAmount(parseInt(e.target.value));
  };

  const handleAdd = () => {
    if (selectedPlayer && selectedProp && amount) {
      const newPlayerData = [
        ...playerData,
        { name: selectedPlayer, prop: selectedProp, amount },
      ];
      setPlayerData(newPlayerData);
      setSelectedPlayer("");
      setSelectedProp("");
      setAmount("");
    }
  };

  return (
    <Container className="calculator">
      <Form>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="player-dropdown">
            {selectedPlayer ? selectedPlayer : "Select Player"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {players &&
              players.map((player) => (
                <Dropdown.Item
                  key={player}
                  onClick={() => handlePlayerChange(player)}
                >
                  {player}
                </Dropdown.Item>
              ))}
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown>
          <Dropdown.Toggle variant="success" id="prop-dropdown">
            {selectedProp ? selectedProp : "Select Prop"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {properties.map((prop) => (
              <Dropdown.Item key={prop} onClick={() => handlePropChange(prop)}>
                {prop}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <Form.Group controlId="amount">
          <Form.Control
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={handleAmountChange}
          />
        </Form.Group>

        <Button variant="primary" onClick={handleAdd}>
          Add
        </Button>
      </Form>

      <div className="playerData">
        {playerData.map((player, index) => (
          <div key={index}>
            <p>{`${player.name} ${player.prop} ${player.amount}`}</p>
          </div>
        ))}
        <Button variant="primary" onClick={() => setCalculate(true)}>
          Calculate
        </Button>
      </div>
      {!loading2 && !error2 && data2 && (
        <div className="calculation">
          <h1>{data2.propCalc.value}</h1>
          <h2>{data2.propCalc.streak}</h2>
        </div>
      )}
    </Container>
  );
};

export default YourComponent;
