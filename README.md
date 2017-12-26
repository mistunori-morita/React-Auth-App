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

## logOut実装
- src/components/Dashbordを作成
```js
import React, { Component } from 'react';

class Dashbord extends Component {
  render() {
    return (
      <div>
        <h1>Dashbord</h1>
        <p>welcome to the dashboard</p>
      </div>
    );
  }
}

export default Dashbord;
```

- App.jsを編集
```js
render() {
//lenderの中で条件分岐の変数を作ってそれを仕込むことでcomponentを分けられる
let page;
if(this.state.idToken){
  page = <Dashbord />
} else {
  page = <Home />
}


  return (
    <div className="App">
      <Header
        lock={this.lock}
        idtoken={this.state.idToken}
        profile={this.state.profile}
         onLoginClick={this.showLock.bind(this)}/>
        <Grid>
          <Row>
            <Col xs={12} md={12}>
            //条件で分けたcomponentを呼び出す方法は{変数名}を書く
              {page}
            </Col>
          </Row>
        </Grid>
    </div>
  );
}
}
```
- Header.jsを編集
```js
import React, { Component } from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';


class Header extends Component {
  onLoginClick(){
    this.props.onLoginClick();
  }

  onLogoutClick(){
    this.props.onLogoutClick();
  }


  render() {
    //idTokenによってcomponentの出し分けの設定
    let navItems;
    if(this.props.idToken) {
      //bootstrapのnavItemsに代入しないと使えないので注意！
      navItems = <NavItem onClick={this.onLoginClick.bind(this)} href="#">Logout</NavItem>
    } else {
      navItems = <NavItem onClick={this.onLoginClick.bind(this)} href="#">Login</NavItem>
    }
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            ReactAuth App
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
        //条件分岐で分けたものを呼び出す
          {navItems}
        </Nav>
      </Navbar>
    );
  }
}

export default Header;

```

- App.jsを編集

```js
//logout関数を定義し、ローカルストレージを含めて空にする
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
    //Dashbordコンポーネントに紐づける
    page = <Dashbord
      lock={this.lock}
      idtoken={this.state.idToken}
      profile={this.state.profile}
      />
  } else {
    page = <Home />
  }

```
- Dashbord.jsを編集
```
import React, { Component } from 'react';
//bootstrapをインポート
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

```
