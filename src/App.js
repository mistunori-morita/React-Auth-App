import React, { Component } from 'react';
import Auth0Lock from 'auth0-lock';
import {Grid, Row, Col} from 'react-bootstrap';
import Header from './components/Header';
import Home from './components/Home';
import Dashbord from './components/Dashbord';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      idToken: '',
      profile: {}
    }
  }


  static defaultProps = {
    clientId: 'xxxxxx',
    domain: 'xxxx.auth0.com'
  }

  componentWillMount(){
    this.lock = new Auth0Lock(this.props.clientId, this.props.domain);


    this.lock.on('authenticated', (authResult) => {
      this.lock.getProfile(authResult.idToken, (error, profile) => {
        if(error){
          console.log(error);
          return
        }
        this.setData(authResult.idToken, profile);
      });
    });

    this.getData();
  }

  setData(idToken, profile){
    localStorage.setItem('idtoken', idToken);
    localStorage.setItem('pforile', JSON.stringify(profile));
    this.setState({
      idToken: localStorage.getItem('idToken'),
      profile: JSON.parse(localStorage.getItem('profile'))
    });
  }

  // check for token and get profile setData
  getData(){
    if(localStorage.getItem('idtoken') != null){
      this.setState({
        idToken: localStorage.getItem('idToken'),
        profile: JSON.parse(localStorage.getItem('profile'))
      }, () => {
        console.log(this.state);
      });
    }
  }

  showLock(){
    this.lock.show();
  }


  logout(){
    this.setState({
      idToken: '',
      profile: ''
    }, () => {
      localStorage.removeItem('idToken');
      localStorage.removeItem('profile');
    });
  }

  render() {
    let page;
    if(this.state.idToken){
      page = <Dashbord
        lock={this.lock}
        idtoken={this.state.idToken}
        profile={this.state.profile}
        />
    } else {
      page = <Home />
    }


    return (
      <div className="App">
        <Header
          lock={this.lock}
          idtoken={this.state.idToken}
          profile={this.state.profile}
          onLogoutClick={this.showLock.bind(this)}
          onLoginClick={this.showLock.bind(this)}/>
          <Grid>
            <Row>
              <Col xs={12} md={12}>
                {page}
              </Col>
            </Row>
          </Grid>
      </div>
    );
  }
}

export default App;
