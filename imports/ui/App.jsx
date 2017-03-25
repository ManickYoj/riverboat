import React, { Component, PropTypes } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch,
} from 'react-router-dom';

// Import utility components
import PrivateRoute from './utilities/PrivateRoute.jsx';
import NotificationSystem from 'react-notification-system';

// Import pages
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import MainMenu from './pages/MainMenu.jsx';
import Lobby from './pages/Lobby.jsx';
import Stage from './pages/Stage.jsx';
import NotFound from './pages/NotFound.jsx';

export default class App extends Component {
	handleError (err, res = null) {
		if (!err) return false;

		this.notify({
			title: err.error || "Server Error",
			message: err.reason || "Check console and terminal for details.",
			level: "error",
		});

		// console.error(err);

		return true;
	}

	notify (notification) {
		this.notifications.addNotification(notification);
	}

	getChildContext() {
		return {
			handleError: this.handleError.bind(this),
			notify: this.notify.bind(this),
		};
	}

	render() {
		const {loading} =this.props;
		return (
			<div>
				<NotificationSystem ref={ref => this.notifications = ref} />
				<Router>
					<Switch>
						<Route exact path="/" component={Home} />
						<Route path="/login" component={Login} />
						<PrivateRoute path="/menu" component={MainMenu} />
						<PrivateRoute path="/lobby/:gameId" component={Lobby} />
						<PrivateRoute path="/stage/:gameId" component={Stage} />
						<Route component={NotFound} />
					</Switch>
				</Router>
			</div>
		);
	}
}

App.childContextTypes = {
	handleError: React.PropTypes.func,
	notify: React.PropTypes.func,
};