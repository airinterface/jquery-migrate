
var warnedAbout = {};

// List of warnings already given; public read only
jQuery.migrateWarnings = [];

// Set to true to prevent console output; migrateWarnings still maintained
// Leave as undefined so that it can be set before plugin is loaded
//jQuery.migrateMute = false;

// Forget any warnings we've already given; public
jQuery.migrateReset = function() {
	warnedAbout = {};
	jQuery.migrateWarnings.length = 0;
};

function migrateWarn( msg) {
	if ( window.JQMIGRATE_WARN ) {
		if ( !warnedAbout[ msg ] ) {
			warnedAbout[ msg ] = true;
			jQuery.migrateWarnings.push( msg );
			if ( window.console && console.warn && !jQuery.migrateMute ) {
				console.warn( "JQMIGRATE: " + msg );
			}
		}
	}
}

function migrateWarnProp( obj, prop, value, msg ) {
	if ( window.JQMIGRATE_WARN && Object.defineProperty ) {
		// On ES5 browsers (non-oldIE), warn if the code tries to get prop;
		// allow property to be overwritten in case some other plugin wants it
		try {
			Object.defineProperty( obj, prop, {
				configurable: true,
				enumerable: true,
				get: function() {
					migrateWarn( msg );
					return value;
				},
				set: function( newValue ) {
					migrateWarn( msg );
					value = newValue;
				}
			});
			return;
		} catch( err ) {
			// IE8 is a dope about Object.defineProperty, can't warn there
		}
	}

	// Non-ES5 (or broken) browser; just set the property
	jQuery._definePropertyBroken = true;
	obj[ prop ] = value;
}

if ( window.JQMIGRATE_WARN && document.compatMode === "BackCompat" ) {
	// jQuery has never supported or tested Quirks Mode
	migrateWarn( "jQuery is not compatible with Quirks Mode" );
}