# React-Auth-App
- firebaseではない方のログイン実装

## 不要なファイルを削除
- `create-react-app xxx`をすると最初に使わないファイルがあるので削除
- svgとか不要なjsファイル等、index.htmlも不要なとこあればお掃除

## 必要なnpmをインストール
- `npm install --save auth0-lock bootstrap react-bootstrap`

```js
//App.jsにインポート
import Auth0Lock from 'auth0-lock'; //綴り注意！
import {Grid, Row, Col} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
```

- src/components/Header.jsを作成
```js
import React, { Component } from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';


class Header extends Component {
  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            ReactAuth App
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem href="#">Home</NavItem>
        </Nav>
      </Navbar>
    );
  }
}

export default Header;

//完成後App.jsにインポート
```

- src/components/Home.jsを作成
```js
import React, { Component } from 'react';

class Home extends Component {
  render() {
    return (
      <div>
        <h1>Welcome</h1>
        <p>Please Login to view dashboard</p>
      </div>
    );
  }
}

export default Home;

//App.jsにインポート
```
- App.js
```js
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

```
