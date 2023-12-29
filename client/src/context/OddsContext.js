import React, { createContext, useContext, useState } from "react";

const OddsContext = createContext();

export const useOddsContext = () => useContext(OddsContext);

export const OddsProvider = ({ children }) => {
  const [oddsData, setOddsData] = useState(null);

  const setOdds = (data) => {
    setOddsData(data);
  };

  return (
    <OddsContext.Provider value={{ oddsData, setOdds }}>
      {children}
    </OddsContext.Provider>
  );
};
