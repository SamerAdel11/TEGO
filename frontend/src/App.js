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
import SidebarSupplier from './containers/sidebar_supplier/Sidebar.js';
import SupplierHome from './containers/supplier_container/Home/SupplierHome.jsx';
import OpenTenders from './containers/supplier_container/openTenders/OpenTenders.jsx';
import AddResponse from './containers/supplier_container/add_Response/AddResponse.jsx';
import YourComponent from './containers/supplier_container/test_response.jsx';
import Awating from './containers/Buyer_container/Awating_Confirmation/Awating.jsx';
import AwatingDetails from './containers/Buyer_container/Awating_Confirmation/AwatingDetails.jsx';

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
function SupplierComponent() {
  return (
    <div className="">
      <NavbarHost />
      <div className="supplier_side">
        <SidebarSupplier />
        <SupplierHome />
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
function OpenTendersComponent() {
  return (
    <div className="">
      <NavbarHost />
      <div className="host_side">
        <SidebarSupplier />
        <OpenTenders />
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
function AddTenderResponse() {
  return (
    <div className="">
      <NavbarHost />
      <div className="supplier_side">
        {/* <SidebarSupplier /> */}
        <AddResponse />
      </div>
    </div>
  );
}

function Awatingg() {
  return (
    <div className="">
      <NavbarHost />
      <div className="host_side">
        <Sidebar />
        <Awating />
      </div>
    </div>
  );
}
function AwatingDetailss() {
  return (
    <div className="">
      <NavbarHost />
      <div className="host_side">
        <Sidebar />
        <AwatingDetails />
      </div>
    </div>
  );
}
function AwatingContact() {
  return (
    <div className="">
      <NavbarHost />
      <div className="host_side">
        <Sidebar />
        <AwatingContact />
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
          <Route path="/test" component={YourComponent} />
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
          <PrivateRoute exact path="/supplier" component={SupplierComponent} />
          <PrivateRoute exact path="/createtnder" component={CreateTenderComponent} />
          <PrivateRoute exact path="/mytender" component={MyTenderComponent} />
          <PrivateRoute exact path="/pendingdecision" component={PendingDecisionComponent} />
          <PrivateRoute exact path="/tender_responses/:id" component={TenderResponsesComponent} />
          <PrivateRoute exact path="/candidate_responses/:id" component={CandidateDetailsfunction} />
          <PrivateRoute exact path="/candidate" component={CandidatePooll} />
          <PrivateRoute exact path="/open_tenders" component={OpenTendersComponent} />
          <PrivateRoute exact path="/add_response" component={AddTenderResponse} />
          <PrivateRoute exact path="/awating" component={Awatingg} />
          <PrivateRoute exact path="/awating_responses/:id" component={AwatingDetailss} />
          <PrivateRoute exact path="/awating_contact/:id" component={AwatingContact} />

        </Switch>
      </AuthProvider>
    </div>
  </Router>
);

export default App;
