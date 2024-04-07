import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Footer, Blog, Possibility, Features, WhatGPT3, Header, SignUpPage, SignUpPage2 } from './containers';
import { Navbar, NavbarHost } from './components';
import { AuthProvider } from './context/Authcontext.js';
import './App.css';
import Sidebar from './containers/sidebar/Sidebar.js';
import ToSign from './containers/ToSign/ToSign';
import SignIn from './containers/signIn/SignIn.jsx';
import HostHome from './containers/Buyer_container/Buyer/HostHome.jsx';
import CreateTender from './containers/Buyer_container/create_tender/CreateTender.jsx';
import WebSocketExample from './containers/signUpPage/WebSocket.jsx';
import MyTenders from './containers/Buyer_container/My_tenders/MyTenders.jsx';

const App = () => (

  <Router>
    <div className="App">
      <AuthProvider>
        <Switch>
          <Route path="/signup" component={SignUpPage} />
          <Route path="/signup2" component={SignUpPage2} />
          <Route path="/sidebar" component={Sidebar} />
          <Route path="/signin" component={SignIn} />
          <Route path="/sign" component={ToSign} />
          <Route path="/notification" component={WebSocketExample} />
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
          <Route path="/createtnder" exact>
            <div className="">
              <NavbarHost />
              <div className="host_side">
                <Sidebar />
                <CreateTender />
              </div>
            </div>
          </Route>
          <Route path="/mytender" exact>
            <div className="">
              <NavbarHost />
              <div className="host_side">
                <Sidebar />
                <MyTenders />
              </div>
            </div>
          </Route>
        </Switch>
      </AuthProvider>
    </div>
  </Router>
);

export default App;
