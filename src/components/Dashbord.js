import React, { Component } from 'react';
import {Grid, Row, Col} from 'react-bootstrap';


class Dashbord extends Component {
  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={9} md={9}>
              <h1>Dashbord</h1>
              <p>welcome to the dashboard</p>
            </Col>
            <Col xs={9} md={9}>
              <img src={this.props.profile} role="pressentation"/>
              <h3>{this.props.profile.nickname}</h3>
              <strong>{this.props.profile.email}</strong>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Dashbord;
