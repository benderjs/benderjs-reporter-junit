# benderjs-reporter-junit

JUnit XML compatible reporter for Bender.js.

## Install
```
npm install benderjs-reporter-junit
```

## Usage

Add `benderjs-reporter-junit` to the `plugins` array in your `bender.js` configuration file.

```js
var config = {
    applications: {...}

    browsers: [...],

    plugins: [
        'benderjs-jasmine',
        'benderjs-reporter-junit' // load the plugin
    ],

    tests: {...}
};

module.exports = config;
```

## Configuration

You can configure the path to the output XML file and a name of a package used by JUnit using `bender.js` configuration file.

```js
var config = {
    applications: {...}

    browsers: [...],

    plugins: [
        'benderjs-jasmine',
        'benderjs-reporter-junit'
    ],
    
    // configure JUnit reporter plugin
    jUnitReporter: {
        outputFile: 'test-reports/bender.xml',
        package: 'Example'
    },

    tests: {...}
};

module.exports = config;
```

Bender will automatically create a path to the output file if it not exist yet.
If no path was given, then a default `bender-result.xml` file will be created in the root directory.

## License

MIT, for license details see: [LICENSE.md](https://github.com/benderjs/benderjs-reporter-junit/blob/master/LICENSE.md)