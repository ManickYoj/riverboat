import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

export default class Login extends Component {
	componentDidMount() {
		// Render login buttons using Blaze
		this.view = Blaze.render(
			Template.loginButtons,
			ReactDOM.findDOMNode(this.refs.container)
		);
	}

	componentWillUnmount() {
		// Clean up Blaze view
		Blaze.remove(this.view);
	}

	render() {
		// Return placeholder for Blaze to put login buttons
		return <span ref="container" />;
	}
}