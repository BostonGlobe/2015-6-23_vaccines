'use strict';

var topojson = require('topojson');
var _ = require('lodash');

var ma = require('../../map/output/ma.json');

var state = topojson.feature(ma, ma.objects.state).features;

var highlight = [
	'hartsbrook school, hadley',
	'kingsley montessori, boston',
	'chatham elementary, chatham'
];

var schools = _(topojson.feature(ma, ma.objects.schools).features)
	.map(function(v) {

		var properties = v.properties;
		var coordinates = v.geometry.coordinates;

		var result = {
			school: properties['School.Name'],
			city: properties.City,
			exemption: Math.ceil(+properties.Exemption),
			lat: coordinates[1],
			lng: coordinates[0]
		};

		result.highlight = _.contains(highlight, [result.school, result.city].join(', ').toLowerCase());

		return result;
	})
	.sortBy(function(d) {
		return -d.exemption;
	})
	// .take(50)
	.value();

module.exports = {
	state,
	schools
};
