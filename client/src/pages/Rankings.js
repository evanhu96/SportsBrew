// BootstrapList.js
import React, { useEffect } from "react";
import { useState, useCallback } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_RANKINGS } from "../utils/queries"; // Replace 'yourQueryFile' with the file containing your query

import {
  ListGroup,
  Button,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  Stack,
} from "react-bootstrap";
const RankingsList = () => {
  const [type, setType] = useState("player");
  const [side, setSide] = useState(-1);
  const [prop, setProp] = useState("PTS");
  const [searchTrigger, setSearchTrigger] = useState(false); // State to control refetch

  const { loading, error, data, refetch } = useQuery(QUERY_RANKINGS, {
    variables: {
      type: "player",
      side: -1,
      prop: "PTS",
    },
  });
  useEffect(() => {
    if (searchTrigger) {
      console.log("Refetching...",side);
      refetch({
        type: type,
        side: side,
        prop: prop,
      });
      setSearchTrigger(false);
    }
  }, [searchTrigger, refetch, type, side, prop]);
  const handleSearch = useCallback(() => {
    setSearchTrigger((prev) => !prev); // Toggle searchTrigger to trigger refetch
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No data!</p>;

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
    "vsScore",
  ];

  const handleTypeChange = (eventKey) => {
    setType(eventKey);
  };
  const handleSideChange = (eventKey) => {
    if(eventKey === "high") setSide(-1);
    else setSide(1);
  };
  const handlePropChange = (eventKey) => {
    setProp(eventKey);
  };
  return (
    <Stack>
      <div className="d-flex justify-content-evenly align-items-center">
        <DropdownButton
          id="dropdown-basic-button-prop"
          title="Prop"
          size="lg"
          onSelect={handlePropChange}
        >
          {properties.map((prop, index) => (
            <Dropdown.Item key={index} eventKey={prop}>
              {prop}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <DropdownButton
          id="dropdown-basic-button-type"
          title="Type"
          size="lg"
          onSelect={handleTypeChange}
        >
          <Dropdown.Item eventKey="player">Player</Dropdown.Item>
          <Dropdown.Item eventKey="team">Team</Dropdown.Item>
        </DropdownButton>
        <DropdownButton
          id="dropdown-basic-button-side"
          title="Side"
          size="lg"
          onSelect={handleSideChange}
        >
          <Dropdown.Item eventKey="high">High</Dropdown.Item>
          <Dropdown.Item eventKey="low">Low</Dropdown.Item>
        </DropdownButton>
        <Button onClick={handleSearch}>Search</Button>
      </div>
      <ListGroup>
        {data && (
          <>
            {data.rankingsValues.map((item, index) => (
              <ListGroup.Item key={index}>
                <Row className="listRow">
                  <Col xs={6} className="d-flex justify-content-center">
                    {item.name}
                  </Col>
                  <Col xs={6} className="d-flex justify-content-center">
                    {item.value}
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </>
        )}
      </ListGroup>
    </Stack>
  );
};

export default RankingsList;
