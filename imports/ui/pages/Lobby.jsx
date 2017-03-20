import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Games } from '../../api/games.js';

import LobbyPlayer from '../components/LobbyPlayer.jsx';

class Lobby extends Component {
	constructor(props) {
		super(props);
		this.state = {invitee: ''};

		this.handleChange = this.handleChange.bind(this);
	}

	componentDidUpdate() {
		this.invite = this.invite.bind(this);
	}

	handleChange(e) {
		this.setState({invitee: e.target.value});
	}

	invite (e) {
		e.preventDefault();

		const { invitee } = this.state;
		const { game } = this.props;

		Meteor.call(
			'games.invite',
			game._id,
			invitee,
			(err, res) => {
				if (this.context.handleError(err)) return;

				this.context.notify({
					level: 'success',
					title: 'Invitation sent.',
					message: 'Awaiting ' + invitee + '\'s response.'
				});
			}
		);
	}

	render() {
		const { game, loading } = this.props;

		if (loading) return <h2>Loading...</h2>;

		const lobbyPlayers = game.players.map(
			(playerId, index) =>
			<LobbyPlayer
				player={Meteor.users.findOne(playerId)}
				game={game}
				key={index}
			/>
		);

		return (
			<div id="Lobby">
				<h1>Lobby</h1>
				<h3>Players</h3>
				<ul>
					{lobbyPlayers}
				</ul>
				<h3>Invite</h3>
				<form onSubmit={this.invite}>
					<label>
						Username:
						<input
							type="text"
							placeholder="eg. FudgeBandit"
							onChange={this.handleChange}
						/>
					</label>
					<input type="submit" value="Send Invitation" />
				</form>
			</div>
		);
	}
};

Lobby.propTypes = {
	game: PropTypes.object,
};

Lobby.contextTypes = {
	handleError: PropTypes.func.isRequired,
	notify: PropTypes.func.isRequired,
};

export default createContainer(({match}) => {
	const handle = Meteor.subscribe('lobby', match.params.gameId, {
		onError: console.error,
	});

	return {
		loading: !handle.ready(),
		game: Games.findOne(match.params.gameId),
	};
}, Lobby);