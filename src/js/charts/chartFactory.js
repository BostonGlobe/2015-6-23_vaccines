'use strict';

// Load libraries.
var d3 = require('d3');

let chart = {

	setupUtilityVariables() {

		var config = this.config;

		config.svg = d3.select(`.scene-maker.scene svg.${this.NAME}`);
		config.scenes = config.svg.select('g.scenes');
		config.main = config.scenes.select('g.main');

		config.width = +config.svg.attr('_innerWidth');
		config.height = +config.svg.attr('_innerHeight');
	},

	render() {
		this.databind();
	},

	draw(scene, opts) {

		// Assign opts to the chart's config.
		Object.assign(this.config, opts);

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
