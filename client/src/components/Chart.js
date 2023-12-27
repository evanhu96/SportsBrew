import React, { useState } from "react";
import { Button, Container, Dropdown, Form, Stack } from "react-bootstrap";
import LineChart from "./LineChart";
function sma(arr, length) {
  const result = [];
  let sum = 0;

  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
    if (i >= length - 1) {
      result.push(sum / length);
      sum -= arr[i - length + 1];
    }
  }

  return result;
}

const YourComponent = ({ playerName, data }) => {
  const [selectedProp, setSelectedProp] = useState("");
  const [playerData, setPlayerData] = useState([]);
  const [dataSets, setDataSets] = useState([]); // [ { label: "Player 1", data: [1, 2, 3, 4, 5] }, { label: "Player 2", data: [1, 2, 3, 4, 5] }

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

  const handlePropChange = (prop) => {
    setSelectedProp(prop);
  };

  const handleAdd = () => {
    if (selectedProp) {
      const newPlayerData = [
        ...playerData,
        { player: playerName, prop: selectedProp },
      ];
      console.log(playerName);
      // log player using data array
      const playerStats = data.teamPlayers.filter(
        (player) => player.name === playerName
      );
      console.log(playerStats, selectedProp);
      setDataSets([
        ...dataSets,
        {
          label: playerName + selectedProp,
          data: sma(playerStats[0][selectedProp], 5),
        },
      ]);
      setPlayerData(newPlayerData);
      setSelectedProp("");
    }
  };

  return (
    <Container className="calculator">
      <Stack>
        <Form>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="prop-dropdown">
              {selectedProp ? selectedProp : "Select Prop"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {properties.map((prop) => (
                <Dropdown.Item
                  key={prop}
                  onClick={() => handlePropChange(prop)}
                >
                  {prop}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Button variant="primary" onClick={handleAdd}>
            Add
          </Button>
        </Form>

        {dataSets.length > 0 && <LineChart datasets={dataSets} />}
      </Stack>
    </Container>
  );
};

export default YourComponent;
