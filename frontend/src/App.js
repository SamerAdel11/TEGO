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
import PendingDecision from './containers/Buyer_container/pending_decision/PendingDecision.jsx';
import TenderDetails from './containers/Buyer_container/pending_decision/TenderDetails.jsx';
import ActivationPage from './containers/activation/Activation';
import EmailVerificationMessage from './containers/activation/EmailVerificationMessage';
import PrivateRoute from './containers/private_routes/private_routes.js';
import CandidatePool from './containers/Buyer_container/Candidate_folder/CandidatePool.jsx';
import CandidateDetails from './containers/Buyer_container/Candidate_folder/CandidateDetails.jsx';

function HostComponent() {
  return (
    <div className="">
      <NavbarHost />
      <div className="host_side">
        <Sidebar />
        <HostHome />
      </div>
    </div>
  );
}
function CreateTenderComponent() {
  return (
    <div className="">
      <NavbarHost />
      <div className="host_side">
        <Sidebar />
        <CreateTender />
      </div>
    </div>
  );
}
function MyTenderComponent() {
  return (
    <div className="">
      <NavbarHost />
      <div className="host_side">
        <Sidebar />
        <MyTenders />
      </div>
    </div>
  );
}
function PendingDecisionComponent() {
  return (
    <div className="">
      <NavbarHost />
      <div className="host_side">
        <Sidebar />
        <PendingDecision />
      </div>
    </div>
  );
}
function TenderResponsesComponent() {
  return (
    <div className="">
      <NavbarHost />
      <div className="host_side">
        <Sidebar />
        <TenderDetails />
      </div>
    </div>
  );
}

function CandidatePooll() {
  return (
    <div className="">
      <NavbarHost />
      <div className="host_side">
        <Sidebar />
        <CandidatePool />
      </div>
    </div>
  );
}
function CandidateDetailsfunction() {
  return (
    <div className="">
      <NavbarHost />
      <div className="host_side">
        <Sidebar />
        <CandidateDetails />
      </div>
    </div>
  );
}

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
          <Route path="/activate/:uidb64/:token" component={ActivationPage} />
          <Route path="/waiting_for_verification" component={EmailVerificationMessage} />
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
          <PrivateRoute exact path="/host" component={HostComponent} />
          <PrivateRoute exact path="/createtnder" component={CreateTenderComponent} />
          <PrivateRoute exact path="/mytender" component={MyTenderComponent} />
          <PrivateRoute exact path="/pendingdecision" component={PendingDecisionComponent} />
          <PrivateRoute exact path="/tender_responses/:id" component={TenderResponsesComponent} />
          <PrivateRoute exact path="/candidate_responses/:id" component={CandidateDetailsfunction} />
          <PrivateRoute exact path="/candidate" component={CandidatePooll} />

        </Switch>
      </AuthProvider>
    </div>
  </Router>
);

export default App;
