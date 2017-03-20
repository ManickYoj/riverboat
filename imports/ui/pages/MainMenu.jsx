import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

class MainMenu extends Component {
	newGame() {
		Meteor.call('games.insert', (err, res) => {
			if (this.context.handleError(err)) return;
			this.props.history.push('/lobby/'+res);
		});
	}

	componentDidUpdate () {
		if (this.props.loading) return;
		const { handleError } = this.context;

		/*
		Display all invites for this user. Dismissing an invite
		rejects it. Accepting redirects to the appropriate lobby.
		*/
		Meteor.user().invites.forEach((invite) => {
			const { gameId, ownerUsername } = invite;

			this.context.notify({
				level: 'info',
				title: 'Game Invite',
				message: ownerUsername + ' has invited you to their game.',
				autoDismiss: 0,
				onRemove: () => Meteor.call(
					'games.rejectInvitation',
					gameId,
					handleError
				),
				action: {
					label: 'Join',
					callback: () => {
						Meteor.call('games.join', gameId, (err, res) => {
							if (handleError(err)) return;
							this.props.history.push('/lobby/'+gameId);
						});
					},
				}
			});
		});
	}

	render() {
		return (
			<div id="Menu">
				<h1> Main Menu</h1>
				<button onClick={this.newGame.bind(this)}>New Game</button>
				{/*<button onClick={this.loadGame.bind(this)}>Load Game</button>*/}
			</div>
		);
	}
}

MainMenu.contextTypes = {
	handleError: React.PropTypes.func.isRequired,
	notify: React.PropTypes.func.isRequired,
};

export default createContainer (() => {
	const handle = Meteor.subscribe('invites');

	return {
		loading: !handle.ready(),
	};
}, MainMenu);