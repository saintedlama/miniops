# MiniOps
MiniOps is a dependency free in memory operations monitor and dashboard. MiniOps is not a full blown operations
monitor and does not want to be this but gives you a glimpse on what's currently going on in your restify services.

MiniOps gives you an overview of

* How many requests were executed with a 1xx, 2xx, 3xx, 4xx, 5xx HTTP status code
* Hourly statistics of requests executed with a 1xx, 2xx, 3xx, 4xx, 5xx HTTP status code
* The last 100 error messages

MiniOps is dependency free so no persistence store (database) is needed but statistics are transient and will vanish
with every service restart!

## MiniOps dashbaord in action

![MiniOps Dashboard](https://raw.github.com/saintedlama/miniops/master/assets/dashboard.png)

## Installation

    $ npm install miniops

## Dashboard
The use the dashboard no HTTP server is required.

You can find the dashboard in directory `node_modules/miniops/dashboard`.

### Using the dashboard
To use the dashboard fire up an editor and adapt line 32 or search for the comment

        // TODO: Set MiniOps data hub URL here

Do what the comment says and point your browser to the MiniOps dashboard index.html file.

## Usage
To use MiniOps in your restify services you need to use jsonp middleware in your restify project and a MiniOps
recorder and a data hub to your restify project.

    var restify = require('restify');
    var MiniOps = require('../index');

    var server = restify.createServer();
    server.use(restify.jsonp());

    // Register routes
    ...

    // Create a MiniOps instance
    var miniOps = new MiniOps();

    // Register MiniOps data hub
    server.get('/ops', miniOps.dataHub());

    // Register MiniOps recorder
    server.on('after', miniOps.recorder());

    server.listen(8080, function() {
        console.log('%s listening at %s', server.name, server.url);
    });

For a complete example see
[MiniOps example](https://github.com/saintedlama/miniops/tree/master/examples).

## License
MiniOps is licenses under the [The BSD 2-Clause License](http://opensource.org/licenses/BSD-2-Clause).
