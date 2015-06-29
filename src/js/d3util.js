'use strict';

var d3 = require('d3');

module.exports = {

	prepareProjectionPath(opts) {

		var datum = opts.datum;
		var width = opts.width;
		var height = opts.height;

		var centroid = d3.geo.centroid(datum);

		// Create a unit projection.
		var projection = d3.geo.albers()
			.scale(1)
			.translate([0, 0])
			.rotate([-centroid[0], 0])
			.center([0, centroid[1]]);

		// Create a path generator.
		var path = d3.geo.path()
			.projection(projection);

		// Compute the bounds of a feature of interest, then derive scale & translate.
		var b = path.bounds(datum),
			s = 1 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
			t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

		// Update the projection to use computed scale & translate.
		projection
			.scale(s)
			.translate(t);

		return {projection, path};
	}

};
