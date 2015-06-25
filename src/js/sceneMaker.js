'use strict';

// Load libraries.
var d3 = require('d3');

// This will hold the scenes array object.
var SCENES;

// Start before 0, since 0 is the first scene.
var currentSceneIndex = -1;

// Utility function.
function log(s) {
	console.log(JSON.stringify(s, null, 4));
}

// This is used to trigger native events.
var events = {};

// This will draw the scene in question.
function drawScene(sceneIndex) {
	document.querySelector('.scene-maker.chartScene').innerHTML = `drawing scene ${sceneIndex}`;
}

// Check if we're at the end.
function atEnd() {
	return currentSceneIndex === SCENES.length - 1;
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
		<button class='btn previous btn--small btn--secondary'>Previous</button>
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

	init(scenes) {

		SCENES = scenes;

		createEvents();
		makeButtons();
		wireButtons();
	},

	// On start, click 'Next'.
	start() {

		document.querySelector('.scene-maker.buttons button.next').dispatchEvent(events.click);
	}

};
