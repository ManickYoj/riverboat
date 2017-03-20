import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Games = new Mongo.Collection('games');

if (Meteor.isServer) {
	/*
	Publish game data for those games the user
	is a player of or invited to.
	*/
	// Meteor.publish(null, function gamesPublication() {
	// 	const user = Meteor.users.findOne(this.userId);
	// 	const gameIds = user.games.concat(user.invites);

	// 	const games = Games.find({
	// 		_id: {$in: gameIds},
	// 	});

	// 	if (games) return games;

	// 	return this.onReady();
	// });

	Meteor.publish('lobby', function (gameId) {
		const user = Meteor.users.findOne(this.userId);

		if (user.games.indexOf(gameId) === -1) {
			throw new Meteor.Error(
				'Error in Lobby Subscription',
				'You are not authorized to access this game\'s data.'
			);
		}

		const gameCursor = Games.find(gameId);
		const game = Games.findOne(gameId);
		const usersCursor = Meteor.users.find(
			{_id: {$in: game.players}},
			{'fields': {username: 1}}
		);

		return lobbyData = [
			gameCursor,
			usersCursor,
		];
	});
}

Meteor.methods({
	'games.insert'() {
		// Reject if user is not logged in
		if (! this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		return Games.insert({
			owner: this.userId,
			ownerUsername: Meteor.user().username,
			createdAt: new Date(),
			invitedPlayers: [],
			players: [this.userId],
			level: null,
		}, (err, res) => {
			Meteor.users.update(this.userId, {
				$addToSet: {games: res}
			});
		});
	},

	'games.remove'(gameId) {
		check(gameId, String);

		// Reject if user is not the game's owner
		const game = Games.findOne(gameId);
		if (game.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		Meteor.users.update(
			{_id: {$in: game.players}},
			{ $pull: { games: game._id }},
			{multi: true},
		(err, res) => {
			Games.remove(gameId);
		});
	},

	'games.invite'(gameId, playerUsername) {
		check(gameId, String);
		check(playerUsername, String);

		const invitedPlayer = Meteor.users.findOne({username: playerUsername});

		// Reject if player cannot be found
		if (!invitedPlayer) {
			throw new Meteor.Error(
				'Invitation Failed',
				'Could not find user \'' + playerUsername + '\'.'
			);
		}

		// Reject if requester is not the game's owner
		const game = Games.findOne(gameId);
		if (game.owner !== this.userId) {
			throw new Meteor.Error(
				'Invitation Failed',
				'You cannot invite players unless you are the game\'s creator.'
			);
		}

		// Reject if the owner is attempting to invite themselves
		if (game.owner === invitedPlayer._id) {
			throw new Meteor.Error(
				'Invitation Failed',
				'Cannot invite yourself to a game.'
			);
		}

		Games.update(gameId, {
			$addToSet: {invitedPlayers: invitedPlayer._id},
		}, (err, res) => {
			if (err) throw new Meteor.Error(
				'Invitation Failed',
				'Could not add the invited player to the game. \
				Contact Nick to report this error.'
			);

			Meteor.users.update(
				invitedPlayer._id,
				{$addToSet: {invites: {
					gameId: gameId,
					ownerUsername: game.ownerUsername,
				}}},
				(err, res) => {
					if (err) throw new Meteor.Error(
						'Invitation Failed',
						'Could not add this game to the player\'s list of invites. \
						Contact Nick to report this error.'
					);
				}
			);
		});
	},

	'games.uninvite'(gameId, playerUsernames) {
		check(gameId, String);
		check(playerUsernames, [String]);

		invitedPlayers = Meteor.users.find({username: {$in: playerUsernames}});

		// Reject if user is not the game's owner
		const game = Games.findOne(gameId);
		if (game.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		Games.update(gameId, {
			$pullAll: {invitedPlayers},
		}, (err, res) => {
			Meteor.users.update(
				{username: {$in: playerUsernames}},
				{$pull: {invites: {gameId}}
			});
		});
	},

	'games.rejectInvitation'(gameId) {
		check(gameId, String);

		Games.update(gameId, {
			$pull: {invitedPlayers: this.userId},
		}, (err, res) => {
			Meteor.users.update(
				this.userId,
				{$pull: {invites: {gameId}}
			});
		});
	},

	'games.join'(gameId) {
		check(gameId, String);

		// Reject if the user has not been invited to this game
		const game = Games.findOne(gameId);

		if (game.invitedPlayers.indexOf(this.userId) === -1) {
			throw new Meteor.Error('not-authorized');
		}

		Games.update(gameId, {
			$pull: {invitedPlayers: this.userId},
			$addToSet: {players: this.userId},
		}, (err, res) => {
			Meteor.users.update(this.userId, {
				$addToSet: {games: gameId},
				$pull: {invites: {gameId}},
			});
		});
	},

	'games.kickPlayer'(gameId, playerId) {
		check(gameId, String);
		check(playerId, String);

		// Reject if the person requesting the kick is not the game's owner
		// Also reject if the owner attempts to kick themselves
		const game = Games.findOne(gameId);
		if (game.owner !== this.userId) {
			throw new Meteor.Error('not-authorized');
		} else if (playerId === this.userId) {
			throw new Meteor.Error('Kick Rejected', 'Cannot kick yourself from the game.');
		}

		Games.update(gameId, {
			$pull: {players: playerId},
		}, (err, res) => {
			Meteor.users.update(
				playerId,
				{ $pull: { games: game._id }}
			);
		});
	},
});