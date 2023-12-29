const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type RankingsValues {
    _id: ID
    name: String
    value: Float
  }
  type RankingsArray {
    _id: ID
    name: String
    team: String
    MIN: [Float]
    FGA: [Float]
    FGM: [Float]
    FTA: [Float]
    FTM: [Float]
    OREB: [Float]
    DREB: [Float]
    REB: [Float]
    AST: [Float]
    STL: [Float]
    BLK: [Float]
    TO: [Float]
    PF: [Float]
    plusMinus: [Float]
    PTS: [Float]
    type: String
    firstHits: FirstHits
  }
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
  type Calculation{
    streak: Int
    value: Float
  }
  type Odd{
    _id:ID
    home:String
    away:String
    overAmt:Float
    underAmt:Float
    overOdds:String
    underOdds:String
    prop:String
    name:String
  }
  input CalcInput {
    name: String
    prop: String
    amount: Int
  }
  type Query {
    propCalc(inputs: [CalcInput],team:String): Calculation!
    rankingsValues(type: String, prop: String, side: Float): [RankingsValues]!
    teamPlayers(team: String): [RankingsArray]!
    odds: [Odd]!
  }
`;

module.exports = typeDefs;
