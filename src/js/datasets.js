'use strict';

var topojson = require('topojson');
var _ = require('lodash');

var ma = require('../../map/output/ma.json');

var state = topojson.feature(ma, ma.objects.state).features;

var possibilities = [
	'hartsbrook school, hadley',
	'kingsley montessori, boston',
	'nantucket elementary, nantucket',
	'chatham elementary, chatham',
	'tisbury elementary, vineyard haven',
	'whitinsville christian school, whitinsville',
	'sacred hearts elementary, bradford',
	'ashby elementary, ashby',
	'muddy brook elementary, great barrington',

	''
];

var width = window.outerWidth;
var highlight;
if (width > 610) {
	highlight = _.take(possibilities, 30);
} else {
	highlight = _.take(possibilities, 3);
}

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
		return d.exemption;
	})
	// .take(50)
	.value();

module.exports = {
	state,
	schools
};
