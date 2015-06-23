'use strict';

var d3 = require('d3');
var topojson = require('topojson');
var globeIframe = require('globe-iframe-resizer');
var chroma = require('chroma-js');
var _ = require('lodash');

var onPymParentResize = function() {};
globeIframe(onPymParentResize);

var ma = require('../../map/output/ma.json');
var state = topojson.feature(ma, ma.objects.MA);
var schools = _(topojson.feature(ma, ma.objects.kinder_rates).features)
	.forEach(function(d) {
		d.properties.Exemption = +d.properties.Exemption;
	})
	.filter(d => d.properties.Exemption > 1)
	.sortBy(d => d.properties.Exemption)
	.value();

var log = function(s) {
	console.log(JSON.stringify(s, null, 4));
};

log(schools);

// make large map
function makeLargeMap() {

	var wrapper = document.querySelector('.large-map-wrapper');

	// empty wrapper
	wrapper.innerHTML = '';

	// create a null projection
	var path = d3.geo.path().projection(null);

	// calculate aspect ratio of state outline
	var bounds = path.bounds(state);
	// var deltaX = bounds[1][0] - bounds[0][0];
	// var deltaY = bounds[1][1] - bounds[0][1];
	// var ratio = deltaX / deltaY;

	// create the map svg
	var svg = d3.select('.large-map-wrapper').append('svg')
		.attr({
			viewBox: `0 0 ${bounds[1][0]} ${bounds[1][1]}`
		});

	// add state g
	var stateG = svg.append('g')
		.attr({
			'class': 'state',
			transform: 'translate(-10, -10)'
		});

	// add state outline
	stateG.append('path')
		.datum(state)
		.attr({
			'class': 'land',
			'd': path
		});

	// add schools g
	var schoolsG = svg.append('g')
		.attr({
			'class': 'schools',
			transform: 'translate(-10, -10)'
		});

	// construct schools radius scale
	var radiusScale = d3.scale.sqrt()
		.domain([0, d3.max(schools, d => d.properties.Exemption)])
		.range([0, 20]);

	var opacityScale = d3.scale.linear()
		.domain([0, d3.max(schools, d => d.properties.Exemption)])
		.range([0.5, 0.8]);


	// construct schools color scale
	// var RED = '#ED1C24';
	// var bezierColors = chroma.interpolate.bezier([chroma(RED).brighten(75), RED]);
	// var bezierColors = chroma.interpolate.bezier(['#FFCE7B', '#F79759', '#DC6951', '#ED1C24']);

	// var colorScale = chroma.scale(bezierColors)
	// 	.domain([0, d3.max(schools, d => d.properties.Exemption)])
	// 	.correctLightness(true);

	// add schools
	schoolsG.selectAll('circle')
		.data(schools)
		.enter().append('circle')
		.attr({
			transform: d => `translate(${path.centroid(d)})`,
			r: d => radiusScale(d.properties.Exemption)
		})
		.style({
			// opacity: d => opacityScale(d.properties.Exemption)
			// fill: d => colorScale(d.properties.Exemption),
			// sstroke: d => colorScale(d.properties.Exemption).darken(15)
		});
}

function resize() {
	makeLargeMap();
}

window.addEventListener('resize', resize);
resize();
