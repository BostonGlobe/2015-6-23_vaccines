'use strict';

// Load libraries.
var d3 = require('d3');

let chart = {

	setupUtilityVariables() {

		this.config.svg = d3.select(`.scene-maker.scene svg.${this.NAME}`);
		this.config.scenes = this.config.svg.select('g.scenes');
		this.config.main = this.config.scenes.select('g.main');

		this.config.width = +this.config.svg.attr('_innerWidth');
		this.config.height = +this.config.svg.attr('_innerHeight');
	},

	render() {
		this.databind();
	},

	draw(scene, opts) {

		this.setupUtilityVariables();
		this.setupScales();
		// this.setupAxes();
		this.scenes[scene](opts);
		this.render();
		// draw();

	}

};

module.exports = function chartFactory(source) {
	return Object.assign(Object.create(chart), source);
};
