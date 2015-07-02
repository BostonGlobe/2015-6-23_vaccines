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
			exemption: Math.ceil(+properties.Exemption),
			lat: coordinates[1],
			lng: coordinates[0]
		};
	})
	.sortBy('exemption')
	.value();

module.exports = {
	state,
	schools
};
