'use strict';

var d3 = require('d3');

var SCENES;
var currentSceneIndex = 0;

function log(s) {
	console.log(JSON.stringify(s, null, 4));
}

function drawScene(sceneIndex) {
	log(`drawing scene ${sceneIndex}`);
}

function atEnd() {
	return currentSceneIndex === SCENES.length - 1;
}

function atBeginning() {
	return currentSceneIndex === 0;
}

function makeButtons() {

	document.querySelector('.scene-maker.buttons').innerHTML = `
		<button class='btn previous btn--small btn--secondary'>Previous</button>
		<button class='btn next     btn--small btn--primary'>Next</button>
	`;
}

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

	init: function(scenes) {

		SCENES = scenes;

		makeButtons();
		wireButtons();
	}

};
