/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext, useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PulseLoader from 'react-spinners/PulseLoader';
import AuthContext from '../../context/Authcontext';
import './private_router.css';

function renderComponentOrRedirect(props, Component, user, loading, allowedRoles, currentRole) {
  if (loading) {
    return (
      <div className="centered-container">
        <PulseLoader
          color="#77E6FD"
          size="20"
        />
      </div>
    );
  }
  const currentView = localStorage.getItem('supplierView');
  if (user && user.company_type === 'supplier') {
    console.log('current role is ', currentRole);

    if (user && (!allowedRoles || allowedRoles.includes(currentRole))) {
      console.log('Role matches');
      return <Component {...props} />;
    }
    if (currentRole === 'buyer') {
      localStorage.setItem('supplierView', JSON.stringify(true));
    } else if (currentRole === 'supplier') {
      localStorage.setItem('supplierView', JSON.stringify(false));
    }
    console.log('didnt matche');
    return <Component {...props} />;
  }
  if (user && (!allowedRoles || allowedRoles.includes(user.company_type))) {
    return <Component {...props} />;
  }
  if (user) {
    return (
      <Redirect
        to={{ pathname: '/not_found', state: { from: props.location } }}
      />
    );
  }

  return (
    <Redirect
      to={{ pathname: '/signin', state: { from: props.location } }}
    />
  );
}

function PrivateRoute({ component: Component, allowedRoles, ...rest }) {
  const { user, loading } = useContext(AuthContext);
  const [currentRole, setCurrentRole] = useState('');
  useEffect(() => {
    const supplierView = localStorage.getItem('supplierView');
    console.log(supplierView, 'from private route');
    if (supplierView && supplierView === 'true') {
      console.log('Supplier');
      setCurrentRole('supplier');
    } else if (supplierView && supplierView === 'false') {
      console.log('buyer');
      setCurrentRole('buyer');
    } else {
      setCurrentRole('supplier');
    }
  }, []);
  return (
    <Route
      {...rest}
      render={(props) => renderComponentOrRedirect(props, Component, user, loading, allowedRoles, currentRole)}
    />
  );
}

export default PrivateRoute;
