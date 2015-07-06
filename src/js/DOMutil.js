'use strict';

module.exports = {

	removeClass(element, className) {

		if (element.classList) {
			element.classList.remove(className);
		}
		else {
			element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}

	},

	addClass(element, className) {

		if (element.classList) {
			element.classList.add(className);
		}
		else {
			element.className += ' ' + className;
		}

	},

	titleCase(str) {
		return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
	}

};
