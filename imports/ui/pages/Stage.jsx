import React, {Component} from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Games } from '../../api/games.js';

class Stage extends Component {
	render () {
		const { game, loading } =this.props;

		if (loading) return <h2>Loading...</h2>;

		console.log(game)

		return (
			<div>

			</div>
		);
	}
}

export default createContainer(({match}) => {
	const handle = Meteor.subscribe('game', match.params.gameId, {
		onError: console.error,
	});

	return {
		loading: !handle.ready(),
		game: Games.findOne(match.params.gameId),
	};
}, Stage);