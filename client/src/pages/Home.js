// ButtonGrid.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

const ButtonGrid = () => {
  return (
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
        <Col className="buttonCol">
          <Link to="/charts">
            <Button className="homeButtons" variant="danger" size="lg">
              Charts
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default ButtonGrid;
