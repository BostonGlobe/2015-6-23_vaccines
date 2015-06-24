'use strict';

var d3 = require('d3');
var topojson = require('topojson');
var globeIframe = require('globe-iframe-resizer');
var _ = require('lodash');

var onPymParentResize = function() {};
globeIframe(onPymParentResize);

var ma = require('../../map/output/ma.json');
var state = topojson.feature(ma, ma.objects.state);
var schools = _(topojson.feature(ma, ma.objects.schools).features)
	.forEach(function(d) {
		d.properties.Exemption = +d.properties.Exemption;
	})
	.sortBy(d => d.properties.Exemption)
	.value();

var log = function(s) {
	console.log(JSON.stringify(s, null, 4));
};

function resize() {

	// Get chart div.
	var chartDiv = document.querySelector('.chart');

	// Empty chart div.
	chartDiv.innerHTML = '';

	// Define margins.
	var margin = {top: 20, right: 20, bottom: 20, left: 20};

	// Define svg dimensions.
	var width = chartDiv.offsetWidth - margin.left - margin.right;
	var height = chartDiv.offsetHeight - margin.top - margin.bottom;

	// Define svg.
	var svg = d3.select(chartDiv).append('svg')
		.attr({
			width: width + margin.left + margin.right,
			height: height + margin.top + margin.bottom
		});

	// Define g.
	var g = svg.append('g')
		.attr({
			transform: `translate(${margin.left}, ${margin.top})`
		});

	// DATA JOIN
	

	function drawAfter() {



	}
	drawAfter();

}

window.addEventListener('resize', resize);
resize();

// // make large map
// function makeLargeMap() {

// 	var wrapper = document.querySelector('.large-map-wrapper');

// 	// empty wrapper
// 	wrapper.innerHTML = '';

// 	// create a null projection
// 	var path = d3.geo.path().projection(null);

// 	// calculate aspect ratio of state outline
// 	var bounds = path.bounds(state);
// 	// var deltaX = bounds[1][0] - bounds[0][0];
// 	// var deltaY = bounds[1][1] - bounds[0][1];
// 	// var ratio = deltaX / deltaY;

// 	// create the map svg
// 	var svg = d3.select('.large-map-wrapper').append('svg')
// 		.attr({
// 			viewBox: `0 0 ${bounds[1][0]} ${bounds[1][1]}`
// 		});

// 	// add state g
// 	var stateG = svg.append('g')
// 		.attr({
// 			'class': 'state',
// 			transform: 'translate(-10, -10)'
// 		});

// 	// add state outline
// 	stateG.append('path')
// 		.datum(state)
// 		.attr({
// 			'class': 'land',
// 			'd': path
// 		});

// 	// add schools g
// 	var schoolsG = svg.append('g')
// 		.attr({
// 			'class': 'schools',
// 			transform: 'translate(-10, -10)'
// 		});

// 	// construct schools radius scale
// 	var radiusScale = d3.scale.sqrt()
// 		.domain([0, d3.max(schools, d => d.properties.Exemption)])
// 		.range([0, 20]);

// 	// add schools
// 	schoolsG.selectAll('circle')
// 		.data(schools)
// 		.enter().append('circle')
// 		.attr({
// 			transform: d => `translate(${path.centroid(d)})`,
// 			r: d => radiusScale(d.properties.Exemption)
// 		});
// }

// function resize() {
// 	makeLargeMap();
// }

