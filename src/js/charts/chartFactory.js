'use strict';

// Load libraries.
var d3 = require('d3');

let chart = {

	setupUtilityVariables() {

		var config = this.config;

		config.svg = d3.select(`.scene-maker.scene svg.${this.NAME}`);
		config.annotations = d3.select(`.scene-maker.scene div.annotations.${this.NAME}`);
		config.scenes = config.svg.select('g.scenes');
		config.main = config.scenes.select('g.main');

		config.width = +config.svg.attr('_innerWidth');
		config.height = +config.svg.attr('_innerHeight');
	},

	getEasing() {
		var config = this.config;
		var easing = config.easing || {};
		return config.moveForward ?
			(easing.forward ? easing.forward : 'cubic-in-out') :
			(easing.backward ? easing.backward : 'cubic-in-out');
	},

	getDuration() {
		var config = this.config;
		var duration = config.duration || {};
		return config.moveForward ?
			(duration.forward ? duration.forward : 0) :
			(duration.backward ? duration.backward : 0);
	},

	getDelay() {
		var config = this.config;
		var delay = config.delay || {};
		return config.moveForward ?
			(delay.forward ? delay.forward : 0) :
			(delay.backward ? delay.backward : 0);
	},

	render() {
		this.databind();
	},

	draw(scene, opts, moveForward) {

		// Assign opts to the chart's config.
		Object.assign(this.config, opts);

		this.config.moveForward = moveForward;

		this.setupUtilityVariables();
		this.setupScales();
		this.setupAxes();
		this.scenes[scene](opts);
		this.render();
		// draw();

	}

};

module.exports = function chartFactory(source) {
	return Object.assign(Object.create(chart), source);
};
