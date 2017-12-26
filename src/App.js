import React, { Component } from 'react';
import Auth0Lock from 'auth0-lock';
import {Grid, Row, Col} from 'react-bootstrap';
import Header from './components/Header';
import Home from './components/Home';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
          <Grid>
            <Row>
              <Col xs={12} md={12}>
                <Home />
              </Col>
            </Row>
          </Grid>
      </div>
    );
  }
}

export default App;
