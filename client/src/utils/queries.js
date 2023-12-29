import { gql } from "@apollo/client";

export const QUERY_RANKINGS = gql`
  query RankingsValues($type: String, $prop: String, $side: Float) {
    rankingsValues(type: $type, prop: $prop, side: $side) {
      _id
      name
      value
    }
  }
`;

export const FIRST_HITS_TYPE = gql`
  type FirstHits {
    make: Float
    assist: Float
    foul: Float
    block: Float
    reb: Float
    steal: Float
    timeout: Float
    subOut: Float
    subIn: Float
    turnover: Float
  }
`;
export const QUERY_TEAM_PLAYERS = gql`
  query Query($team: String) {
    teamPlayers(team: $team) {
      _id
      name
      team
      MIN
      FGA
      FGM
      FTA
      FTM
      OREB
      DREB
      REB
      AST
      STL
      BLK
      TO
      PF
      plusMinus
      PTS
      type
      firstHits {
        make
        assist
        foul
        block
        reb
        steal
        timeout
        subOut
        subIn
        turnover
      }
    }
  }
`;
// Define the CalcInput type
export const CALC_INPUT_TYPE = gql`
  input CalcInput {
    name: String
    prop: String
    amount: Int
  }
`;

export const QUERY_PROP_CALC = gql`
  query PropCalc($inputs: [CalcInput], $team: String) {
    propCalc(inputs: $inputs, team: $team) {
      streak
      value
    }
  }
`;
export const GET_ODDS = gql`
  query Odds {
    odds {
      _id
      home
      away
      overAmt
      underAmt
      overOdds
      underOdds
      prop
      name
    }
  }
`;
