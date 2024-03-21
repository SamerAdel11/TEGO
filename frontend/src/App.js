import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Footer, Blog, Possibility, Features, WhatGPT3, Header, SignUpPage, SignUpPage2 } from './containers';
import { Navbar, NavbarHost } from './components';
import './App.css';
import Sidebar from './containers/sidebar/Sidebar.js';
import ToSign from './containers/ToSign/ToSign';
import SignIn from './containers/signIn/SignIn.jsx';
import HostHome from './containers/Buyer/HostHome.jsx';

const App = () => (

  <Router>
    <div className="App">
      <Switch>
        <Route path="/signup" component={SignUpPage} />
        <Route path="/signup2" component={SignUpPage2} />
        <Route path="/sidebar" component={Sidebar} />
        <Route path="/signin" component={SignIn} />
        <Route path="/sign" component={ToSign} />
        <Route path="/" exact>
          <div className="gradient__bg">
            <Navbar />
            <Header />
          </div>
          <WhatGPT3 />
          <Features />
          <Possibility />
          <Blog />
          <Footer />
        </Route>
        <Route path="/host" exact>
          <div className="">
            <NavbarHost />
            <div className="host_side">
              <Sidebar />
              <HostHome />
            </div>
          </div>
        </Route>
      </Switch>
    </div>
  </Router>
);

export default App;
