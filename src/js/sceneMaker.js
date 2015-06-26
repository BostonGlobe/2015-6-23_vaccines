'use strict';

// Load libraries.
var d3 = require('d3');
var _ = require('lodash');

// This will hold the SCENE_DEFINITIONS array object.
var SCENE_DEFINITIONS;

// Hold current scene.
var currentSceneIndex = 0;

// Utility function.
function log(s) {
	console.log(JSON.stringify(s, null, 4));
}

// This is used to trigger native events.
var events = {};

// This will draw the scene in question.
function drawScene(sceneIndex, opts) {

	// Get the correct scene definition.
	var sceneDefinition = SCENE_DEFINITIONS[sceneIndex];

	// Retrieve the chart file.
	var chart = require(`./charts/${sceneDefinition.chart}`);

	// Construct options.
	var options = _.assign(sceneDefinition.options, opts);

	// Draw scene.
	chart.draw(sceneDefinition.scene, options);
}

// Check if we're at the end.
function atEnd() {
	return currentSceneIndex === SCENE_DEFINITIONS.length - 1;
}

// Check if we're at the beginning.
function atBeginning() {
	return currentSceneIndex === 0;
}

// This creates native events like 'click'.
function createEvents() {
	events.click = document.createEvent('MouseEvent');
	events.click.initEvent('click', true, true);
}

// This will make buttons. Call this once.
function makeButtons() {

	document.querySelector('.scene-maker.buttons').innerHTML = `
		<button class='btn previous btn--small btn--secondary btn--disabled' disabled>Previous</button>
		<button class='btn next     btn--small btn--primary'>Next</button>
	`;
}

// This will wire buttons to their event handlers.
function wireButtons() {

	// Get buttons.
	var buttons = document.querySelectorAll('.scene-maker.buttons button');

	// Create click handler function.
	function buttonClickHandler(e) {

		var html = e.target.innerHTML;
		var isNext = html === 'Next';
		var previous = document.querySelector('.scene-maker.buttons button.previous');
		var next = document.querySelector('.scene-maker.buttons button.next');

		if (isNext) {
			// only go forward if we're not at the end
			if (!atEnd()) {
				currentSceneIndex++;
			}
		} else {
			// only go back if we're not at the beginning
			if (!atBeginning()) {
				currentSceneIndex--;
			}
		}

		// Enable/disable buttons accordingly.
		previous.disabled = atBeginning();
		next.disabled = atEnd();

		// Style buttons accordingly.
		d3.select(previous).classed('btn--disabled', atBeginning());
		d3.select(next).classed('btn--disabled', atEnd());

		// Draw scene.
		drawScene(currentSceneIndex);
	}

	// Add event listeners to buttons.
	for (let i = 0; i < buttons.length; i++) {
		buttons[i].addEventListener('click', buttonClickHandler);
	}
}

module.exports = {

	init(scene_definitions) {

		SCENE_DEFINITIONS = scene_definitions;

		createEvents();
		makeButtons();
		wireButtons();
	},

	resize () {

		// Recreate the svg container.

		// Get the container.
		var container = document.querySelector('.scene-maker.scene');

		// Empty the container.
		container.innerHTML = '';

		// Define margins.
		var margin = {top: 20, right: 20, bottom: 20, left: 20};

		// Define svg dimensions.
		var width = container.offsetWidth - margin.left - margin.right;
		var height = container.offsetHeight - margin.top - margin.bottom;

		// Define svg.
		var svg = d3.select(container).append('svg')
			.attr({
				width: width + margin.left + margin.right,
				height: height + margin.top + margin.bottom
			});

		// Define g.
		var g = svg.append('g')
			.attr({
				transform: `translate(${margin.left}, ${margin.top})`
			});

		// Draw the current scene with duration 0 (no transitions).
		drawScene(currentSceneIndex, {
			duration: 0
		});
	}

};














