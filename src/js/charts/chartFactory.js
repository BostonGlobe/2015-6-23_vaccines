'use strict';

// Load libraries.
var d3 = require('d3');

let chart = {

	config: {},

	render() {
		this.databind();
	},

	draw(scene, opts) {

		this.config.svg = d3.select(`.scene-maker.scene svg.${this.NAME}`);
		this.config.width = +this.config.svg.attr('_innerWidth');
		this.config.height = +this.config.svg.attr('_innerHeight');

		this.config.scenes = this.config.svg.select('g.scenes');
		this.config.main = this.config.scenes.select('g.main');

		this.setupUtilityVariables();

		// this.setupScales();
		// this.setupAxes();
		// scenes[scene](opts);
		this.render();
		// draw();

	}

};

module.exports = function chartFactory(source) {
	return Object.assign(Object.create(chart), source);
};
