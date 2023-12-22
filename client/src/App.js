import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import "bootstrap/dist/css/bootstrap.min.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";

import PropCalculator from "./pages/PropCalculator";
import Rankings from "./pages/Rankings";
import Stats from "./pages/Stats";
const httpLink = createHttpLink({
  uri: "http://localhost:3001/graphql", // Replace with your server's GraphQL endpoint
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Container id="homeContainer">
          <Row className="button-row">
            <Col className="buttonCol">
              <Link to="/rankings">
                <Button className="homeButtons" variant="primary" size="lg">
                  Rankings
                </Button>
              </Link>
            </Col>
            <Col className="buttonCol">
              <Link to="/stats">
                <Button className="homeButtons" variant="secondary" size="lg">
                  Stats
                </Button>
              </Link>
            </Col>
          </Row>
          <Row className="button-row">
            <Col className="buttonCol">
              <Link to="/propcalc">
                <Button className="homeButtons" variant="success" size="lg">
                  Prop Calc
                </Button>
              </Link>
            </Col>
       
          </Row>
          <Routes>
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/propcalc" element={<PropCalculator />} />
          </Routes>
        </Container>
      </Router>
    </ApolloProvider>
  );
}
export default App;
