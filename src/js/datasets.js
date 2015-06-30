'use strict';

var topojson = require('topojson');
var _ = require('lodash');

var ma = require('../../map/output/ma.json');

var state = topojson.feature(ma, ma.objects.state).features;

var schools = _(topojson.feature(ma, ma.objects.schools).features)
	.map(function(v) {

		var properties = v.properties;
		var coordinates = v.geometry.coordinates;

		return {
			school: properties['School.Name'],
			city: properties.City,
			exemption: +properties.Exemption,
			lat: coordinates[1],
			lng: coordinates[0]
		};
	})
	.sortBy('exemption')
	.filter(function(v, i) {
		return v.exemption;
	})
	// .reverse()
	// .take(3)
	// .take(500)
	.value();

module.exports = {
	state,
	schools
};
