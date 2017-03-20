import React, { Component } from 'react';

class Friend extends Component {
	remove () {

	}

	invite () {

	}

	render () {

	}
}

Friend.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
	Meteor.subscribe('tasks');

	return {
		tasks: Tasks.find({}, {sort: {createdAt: -1} }).fetch(),
		incompleteCount: Tasks.find({ checked: {$ne: true} }).count(),
		currentUser: Meteor.user(),
	};
}, App);