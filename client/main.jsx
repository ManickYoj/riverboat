// Import external libraries
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
} from 'react-router-dom';

// Import startup files
import '../imports/startup/accounts-config.js';

import App from '../imports/ui/App.jsx';

Meteor.startup(() => {
	render(
		<App />,
	document.getElementById('render-target'));
});