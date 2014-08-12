var builder = require( 'xmlbuilder' ),
	path = require( 'path' ),
	fs = require( 'fs' ),
	xml;

module.exports = {
	name: 'bender-reporter-junit',

	attach: function() {
		var bender = this,
			packageName = bender.conf.jUnitReporter && bender.conf.jUnitReporter.package || '';

		xml = builder.create( 'testsuites' );

		bender.on( 'client:afterRegister', function( client ) {
			var browser = client.browser + client.version,
				suite = xml.ele( 'testsuite', {
					name: browser,
					timestamp: ( new Date() ).toISOString().substr( 0, 19 ),
					package: packageName,
					id: 0
				} ),
				props = suite.ele( 'properties' );


			props.ele( 'property', {
				name: 'userAgent',
				value: client.ua
			} );

			props.ele( 'property', {
				name: 'address',
				value: client.addr
			} );
		} );

		bender.on( 'client:complete', function( data ) {
			var className = ( packageName ? packageName + '.' : '' ) +
				data.client.browser + data.client.version + '.' + data.id.replace( /\.|\?|=/g, '_' ),
				suite = xml.ele( 'testsuite', {
					name: className,
					timestamp: ( new Date() ).toISOString().substr( 0, 19 ),
					package: packageName
				} ),
				passed = 0,
				failed = 0,
				ignored = 0,
				duration = 0,
				total = 0,
				errors = 0;


			Object.keys( data.results ).forEach( function( name ) {
				var result = data.results[ name ],
					spec = suite.ele( 'testcase', {
						name: result.fullName,
						time: ( result.duration || 0 ) / 1000,
						className: className
					} );

				total++;

				if ( result.success ) {
					if ( result.ignored ) {
						ignored++;
						spec.ele( 'skipped' );
					} else {
						passed++;
					}
				} else {
					failed++;
					spec.ele( 'failure', {}, result.error );
				}
			} );

			suite.att( 'tests', total );
			suite.att( 'errors', errors > 0 ? 1 : 0 );
			suite.att( 'failures', failed );
			suite.att( 'time', ( duration || 0 ) / 1000 );
		} );
	},

	detach: function( done ) {
		var bender = this,
			filePath = bender.conf.jUnitReporter && bender.conf.jUnitReporter.outputFile || path.join( process.cwd(),
				'bender-result.xml' );

		bender.utils.mkdirp( path.dirname( filePath ), function( err ) {
			if ( err ) {
				return done( err );
			}

			fs.writeFile( filePath, xml.end( {
				pretty: true
			} ), done );
		} );
	}
};
