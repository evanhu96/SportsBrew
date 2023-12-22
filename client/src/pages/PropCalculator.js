import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Calculator from "../components/Calculator";
import Teams from "../components/Teams";

const Stats = () => {
  const [team, setTeam] = useState("");

  return (
    <div>
      {team === "" ? (
        <div>
          <h1>Choose a team</h1>
          <Teams setTeam={setTeam} />
        </div>
      ) : (
        <>
          <Button onClick={() => setTeam("")}>Back</Button>
          <Calculator team={team}  />
        </>
      )}
    </div>
  );
};

export default Stats;
