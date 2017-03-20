import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class Home extends Component {
	render() {
		const props = this.props;

		return Meteor.userId() ? <Redirect to={{
        pathname: '/menu',
        state: { from: props.location }
      }}/> : <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>;
	}
}