import React from 'react';
import { render } from 'react-dom';
import {
	Route,
	Redirect,
} from 'react-router-dom';

// Define a private route
const PrivateRoute = ({ component, ...rest }) => (
  <Route {...rest} render={props => (
    Meteor.userId() ? (
      React.createElement(component, props)
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

export default PrivateRoute;