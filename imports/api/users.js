import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((opts, user) => {
	// Add custom user data
	user.games = [];
	user.invites =[];
	user.friends = [];

	// Restore default creation behavior
	if (opts.profile) user.profile = opts.profile;
	return user;
});

if (Meteor.isServer) {
	Meteor.publish('users', function () {
		return Meteor.users.find(
			{},
			{'fields': {'username': 1}}
		);
	});

	Meteor.publish('invites', function () {
		return Meteor.users.find(
			{_id: this.userId},
			{'fields': {'invites': 1}}
		);
	});
}