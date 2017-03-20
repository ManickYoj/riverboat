import React, { Component, PropTypes } from 'react';

export default class LobbyPlayer extends Component {
	kick() {
		const { game, player } = this.props;

		Meteor.call(
			'games.kickPlayer',
			game._id,
			player._id,
			this.context.handleError
		);
	}

	render() {
		const { game, player } = this.props;

		// Only show option to kick a player if the user is
		// the game's owner and don't allow kicking oneself
		const kickButton = game.owner === Meteor.userId() &&
		player._id !== Meteor.userId() ?
		<button onClick={this.kick.bind(this)}>
			Kick
		</button>
		: "";

		return (
			<li>
				{kickButton}
				<span> {player.username}</span>
			</li>
		);
	}
}

LobbyPlayer.PropTypes = {
	player: PropTypes.object.isRequired,
	game: PropTypes.object.isRequired,
};

LobbyPlayer.contextTypes = {
	handleError: PropTypes.func.isRequired,
};