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

## Login Module & Get Token
- `https://manage.auth0.com/#/`でユーザー登録をしておく
- 登録後、ダッシュボードに入れるのでその情報等を使う
- eventの設定
```js

//event関数を定義
onLoginClick(){
  console.log('Clicked');
}
//動くことが確認できたらAuth0Lockが使えるように関数を変更
onLoginClick(){
  this.props.onLoginClick();
}

<Nav>
//eventハンドラを設定
  <NavItem onClick={this.onLoginClick.bind(this)}href="#">Home</NavItem>
</Nav>
```

- App.jsを編集
```js

//ここでauth0の「クライアント」に記載されているものを入力していく
static defaultProps = {
  clientId: '_Kuy2VVyI1tGJTBhZcQOw0SalUgVH6dV',
  domain: 'mitukun.auth0.com',
}

//componentWilMountでdefaultPropsに設定した情報にアクセスできるようにする
  componentWillMount(){
  this.lock = new Auth0Lock(this.props.clientId, this.props.domain);
}

showLock(){
  this.lock.show();
}

render() {
  return (
    <div className="App">
      <Header onLoginClick={this.showLock.bind(this)}/>
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
```
## ログイン機能の実装
```js
componentWillMount(){
  this.lock = new Auth0Lock(this.props.clientId, this.props.domain);

  // On authentication 追加
  this.lock.on('authenticated', (authResult) => {
    this.lock.getProfile(authResult.idToken, (error, profile) => {
      if(error){
        console.log(error);
        return;
      }

      console.log(profile);
    });
  });
}
//ここが問題なければログイン時にコンソールログで情報が取れている

```

## トークン情報を元にローカルストレージにセット
```js
componentWillMount(){
  this.lock = new Auth0Lock(this.props.clientId, this.props.domain);


  this.lock.on('authenticated', (authResult) => {
    this.lock.getProfile(authResult.idToken, (error, profile) => {
      if(error){
        console.log(error);
        return
      }
      //ここでセット
      this.setData(authResult.idToken, profile);
    });
  });
}

//setData関数にローカルストレージをセットステートで保持する
setData(idToken, profile){
  localStorage.setItem('idtoken', idToken);
  localStorage.setItem('pforile', JSON.stringify(profile));
  this.setState({
    idToken: localStorage.getItem('idToken'),
    profile: JSON.parse(localStorage.getItem('profile'))
  });
}

```

- getData関数を作成
```js
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
```

- componentWillMountで呼び出し
```js
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

  //ここで呼び出し
  this.getData();
}
```
