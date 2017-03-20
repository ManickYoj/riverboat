import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import Level from './Level.jsx';
import { rnorm } from 'randgen';

export default class Game extends Component {
	generateLevel() {
		const riverConfig = {
			baseLength: 50,
			lengthScaling: 5,
			avgWidth: 1,
			centerVariation: 0.5,
			widthVariation: .25,
			startLength: 5,
			endLength: 5,
		};

		const rc = riverConfig;
		const index = 0;
		const riverLength = rc.baseLength +
			index * rc.lengthScaling;

		const course = [];

		let n;
		for (i=0; i < riverLength-rc.startLength-rc.endLength; i++) {
			do {
				n = {
					center: rnorm(0, rc.centerVariation),
					width: rnorm(rc.avgWidth, rc.widthVariation),
				};
			} while (
				n.center + n.width/2 >= 1 ||
				n.center - n.width/2 <= -1
			);

			course.push(n);
		}

		for (i=0; i < rc.startLength; i++)
			course.unshift({
				center: 0,
				width: rc.avgWidth,
			});

		for (i=0; i < rc.endLength; i++)
			course.push({
				center: 0,
				width: rc.avgWidth,
			});

		const level = {
			index,
			course,
		};

		console.log(level);
		return level;
	}

	render () {
		const levelConfig = this.generateLevel();
		return (
			<Level config={levelConfig} />
		);
	}
}