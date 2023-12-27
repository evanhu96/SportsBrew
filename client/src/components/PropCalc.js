import { useQuery } from "@apollo/client";
import { QUERY_PROP_CALC } from "../utils/queries";

const PropCalc = async ({ inputs, team }) => {
  const { loading, error, data } = useQuery(QUERY_PROP_CALC, {
    variables: { inputs: inputs, team: team },
  });
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  return data.propCalc;
};

export default PropCalc;
