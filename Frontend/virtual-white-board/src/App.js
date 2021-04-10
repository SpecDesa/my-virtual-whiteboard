
import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import './App.css';

import Login from './Login.js'
import VirtualWhiteBoard from './VirtualWhiteBoard.js'

/**
 * App component for rendering two Routes. Login form and The virtual whiteboard.
 */
class App extends Component {
  constructor() {
    super();
    this.state = {
      allowChangingPage: false,
      userLoggedIn: '',
      userPassword: '',
    }

    this.authorize = this.authorize.bind(this);
  }

  /**
   * Authorize function for validating username - password.
   * @param {*} username 
   * @param {*} password 
   */
  authorize(username, password) {
    this.setState({ allowChangingPage: true, userLoggedIn: username, userPassword: password })
  }

  
  render() {
    return (
      <div className="App">
        {this.state.allowChangingPage && <Redirect to='/virtualwhiteboard' />}
        <Route exact path='/' render={() => <Login authorize={this.authorize} />} />
        <Route exact path='/virtualwhiteboard' render={() => <VirtualWhiteBoard username={this.state.userLoggedIn} password={this.state.userPassword} />} />
      </div>
    );
  }
}

export default App;
