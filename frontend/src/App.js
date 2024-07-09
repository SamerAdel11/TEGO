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
import Awating from './containers/Buyer_container/Awating_Confirmation/Awating.jsx';
import AwatingDetails from './containers/Buyer_container/Awating_Confirmation/AwatingDetails.jsx';
import AwardedTenders from './containers/supplier_container/participated_tenders/AwardedOffers/AwardedTenders.jsx';
import CandidatePoolOffers from './containers/supplier_container/participated_tenders/candidatePoolOffers/candidatePoolOffers.jsx';
import RejectedOffers from './containers/supplier_container/participated_tenders/RejectedOffers/RejectedOffers.jsx';
import OfferedOffers from './containers/supplier_container/participated_tenders/OfferedOffers/OfferedOffers.jsx';
import Response from './containers/supplier_container/participated_tenders/ResponseView/tenderWithOffer.jsx';
import Draft from './containers/Buyer_container/draft_tenders/DraftTenders.jsx';
import DraftDetails from './containers/Buyer_container/draft_tenders/draftDetails.jsx';
import Test from './containers/Buyer_container/test/test.jsx';
import NotFoundPage from './containers/not_found/NotFoundPage.jsx';
import HostContracts from './containers/Buyer_container/host_contracts/ContractList.jsx';
import SupplierContracts from './containers/supplier_container/contracts/Contracts.jsx';
import OpenedTenderDetails from './containers/Buyer_container/My_tenders/OpenTenderDetails.jsx';
import CancelledTenders from './containers/Buyer_container/cancelled_tenders/CancelledTenders.jsx';
import CancelledTenderDetails from './containers/Buyer_container/cancelled_tenders/CancelledTendersDetails.jsx';
import TemplateTender from './containers/Buyer_container/template/TemplateTender.jsx';
import TemplateTenderDetails from './containers/Buyer_container/template/TemplateTenderDetails.jsx';

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
        <SidebarSupplier />
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
function DraftTender() {
  return (
    <div className="">
      <NavbarHost />
      <div className="host_side">
        <Sidebar />
        <Draft />
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
function AwardedTendersFunc() {
  return (
    <div className="">
      <NavbarHost />
      <div className="supplier_side">
        <SidebarSupplier />
        <AwardedTenders />
      </div>
    </div>
  );
}
function CandidatePoolOffersFunc() {
  return (
    <div className="">
      <NavbarHost />
      <div className="supplier_side">
        <SidebarSupplier />
        <CandidatePoolOffers />
      </div>
    </div>
  );
}
function RejectedOffersFunc() {
  return (
    <div className="">
      <NavbarHost />
      <div className="supplier_side">
        <SidebarSupplier />
        <RejectedOffers />
      </div>
    </div>
  );
}
function OfferedOffersFunc() {
  return (
    <div className="">
      <NavbarHost />
      <div className="supplier_side">
        <SidebarSupplier />
        <OfferedOffers />
      </div>
    </div>
  );
}
function TestFunc() {
  return (
    <div className="">
      <NavbarHost />
      <div className="supplier_side">
        <SidebarSupplier />
        <Response />
      </div>
    </div>
  );
}
function DraftTenderDetailsFun() {
  return (
    <div className="">
      <NavbarHost />
      <div className="host_side">
        <Sidebar />
        <DraftDetails />
      </div>
    </div>
  );
}
function HostContractFun() {
  return (
    <div className="">
      <NavbarHost />
      <div className="host_side">
        <Sidebar />
        <HostContracts />
      </div>
    </div>
  );
}
function SupplierContractFun() {
  return (
    <div className="">
      <NavbarHost />
      <div className="host_side">
        <SidebarSupplier />
        <SupplierContracts />
      </div>
    </div>
  );
}
function OpenedTenderDetailFun() {
  return (
    <div className="">
      <NavbarHost />
      <div className="host_side">
        <Sidebar />
        <OpenedTenderDetails />
      </div>
    </div>
  );
}
function CancelledTenderFun() {
  return (
    <div className="">
      <NavbarHost />
      <div className="host_side">
        <Sidebar />
        <CancelledTenders />
      </div>
    </div>
  );
}
function TemplateTenderFun() {
  return (
    <div className="">
      <NavbarHost />
      <div className="host_side">
        <Sidebar />
        <TemplateTender />
      </div>
    </div>
  );
}
function TemplateTenderDetailsFun() {
  return (
    <div className="">
      <NavbarHost />
      <div className="host_side">
        <Sidebar />
        <TemplateTenderDetails />
      </div>
    </div>
  );
}
function CancelledTenderDetail() {
  return (
    <div className="">
      <NavbarHost />
      <div className="host_side">
        <Sidebar />
        <CancelledTenderDetails />
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
          {/* <Route exact path="/not_found" />
            <div>
              <Header />
              <NotFoundPage />
            </div>
          </Route> */}
          <PrivateRoute exact path="/host" component={HostComponent} allowedRoles={['buyer']} />
          <PrivateRoute exact path="/create_tender" component={CreateTenderComponent} allowedRoles={['buyer']} />
          <PrivateRoute exact path="/mytender" component={MyTenderComponent} allowedRoles={['buyer']} />
          <PrivateRoute exact path="/pendingdecision" component={PendingDecisionComponent} allowedRoles={['buyer']} />
          <PrivateRoute exact path="/tender_responses/:id" component={TenderResponsesComponent} allowedRoles={['buyer']} />
          <PrivateRoute exact path="/candidate_responses/:id" component={CandidateDetailsfunction} allowedRoles={['buyer']} />
          <PrivateRoute exact path="/candidate" component={CandidatePooll} allowedRoles={['buyer']} />
          <PrivateRoute exact path="/awating" component={Awatingg} allowedRoles={['buyer']} />
          <PrivateRoute exact path="/awating_responses/:id" component={AwatingDetailss} allowedRoles={['buyer']} />
          <PrivateRoute exact path="/awating_contact/:id" component={AwatingContact} allowedRoles={['buyer']} />
          <PrivateRoute exact path="/awarded_tenders" component={AwardedTendersFunc} allowedRoles={['supplier']} />
          <PrivateRoute exact path="/supplier" component={SupplierComponent} allowedRoles={['supplier']} />
          <PrivateRoute exact path="/open_tenders" component={OpenTendersComponent} allowedRoles={['supplier']} />
          <PrivateRoute exact path="/add_response" component={AddTenderResponse} allowedRoles={['supplier']} />
          <PrivateRoute exact path="/candidate_pool_offers" component={CandidatePoolOffersFunc} allowedRoles={['supplier']} />
          <PrivateRoute exact path="/rejected_offers" component={RejectedOffersFunc} allowedRoles={['supplier']} />
          <PrivateRoute exact path="/offered_offers" component={OfferedOffersFunc} allowedRoles={['supplier']} />
          <PrivateRoute exact path="/supplier_contracts" component={SupplierContractFun} allowedRoles={['supplier']} />
          <PrivateRoute exact path="/draft_tenders" component={DraftTender} allowedRoles={['buyer']} />
          <PrivateRoute exact path="/draft_tender_details/:id" component={DraftTenderDetailsFun} allowedRoles={['buyer']} />
          <PrivateRoute exact path="/host_contracts" component={HostContractFun} allowedRoles={['buyer']} />
          <PrivateRoute exact path="/tender/:id" component={OpenedTenderDetailFun} allowedRoles={['buyer']} />
          <PrivateRoute exact path="/cancelled_tenders_details/:id" component={CancelledTenderDetail} allowedRoles={['buyer']} />
          <PrivateRoute exact path="/cancelled_tenders/" component={CancelledTenderFun} allowedRoles={['buyer']} />
          <PrivateRoute exact path="/template_tenders/" component={TemplateTenderFun} allowedRoles={['buyer']} />
          <PrivateRoute exact path="/template_tenders_details/:id" component={TemplateTenderDetailsFun} allowedRoles={['buyer']} />
          <PrivateRoute exact path="/tender_offer" component={TestFunc} allowedRoles={['supplier']} />
          <PrivateRoute exact path="/test" component={Test} />

          <Route exact path="/not_found">
            <div>
              <NavbarHost />
              <NotFoundPage />
            </div>
          </Route>
          <Route path="*">
            <div>
              <Navbar />
              <NotFoundPage />
            </div>
          </Route>
        </Switch>
      </AuthProvider>
    </div>
  </Router>
);

export default App;
