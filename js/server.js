// server.js - NodeJS server for the PiThermServer project.

/* 

Parses data from DS18B20 temperature sensor and serves as a JSON object.
Uses node-static module to serve a plot of current temperature (uses highcharts).

Tom Holderness 03/01/2013
Ref: www.cl.cam.ac.uk/freshers/raspberrypi/tutorials/temperature/
*/

// Load node modules
var fs = require('fs');
var sys = require('sys');
var http = require('http');
var sqlite3 = require('sqlite3');

// Use node-static module to server chart for client-side dynamic graph
var nodestatic = require('node-static');

// Setup static server for current directory
var staticServer = new nodestatic.Server(".");

// Setup database connection for logging
var db = new sqlite3.Database('../piTemps.db');

// Get temperature records from database
function selectTemp(callback){
   // - callback is the output function
   // console.log('Executing query: SELECT id, unix_time, round(celsius*9/5 + 32,1) farenheit FROM temps WHERE unix_time > (strftime(\'%s\',\''+start_date+'\')) ORDER BY id, unix_time ASC ;');
   var current_temp = db.all("SELECT id, (unix_time-21600)*1000 unix_time, round(celsius*9/5 + 32,1) farenheit, humidity FROM temps ORDER BY id, unix_time ASC;",
      function(err, rows){
         if (err){
			   response.writeHead(500, { "Content-type": "text/html" });
			   response.end(err + "\n");
			   console.log('Error querying database. ' + err);
			   return;
				      }
         data = {temps:[rows]}
         callback(data);
   });
};

// /temperature_angular_query.json

// Get temperature records from database
function selectNowTemp(callback){
   // - callback is the output function
   // console.log('Executing query: SELECT unix_time*1000 unix_time, round(celsius*9/5 + 32,1) farenheit FROM temps WHERE unix_time = (select max(unix_time) from temps) limit 1;');
   var current_temp = db.all("SELECT unix_time*1000 unix_time, round(celsius*9/5 + 32,1) farenheit, humidity FROM temps WHERE unix_time =(select max(unix_time) from temps) limit 1;", 
      function(err, rows){
         if (err){
			   response.writeHead(500, { "Content-type": "text/html" });
			   response.end(err + "\n");
			   console.log('Error querying database. ' + err);
			   return;
				      }
         data = {temps:[rows]}
         callback(data);
   });
};

// Setup node http server
var server = http.createServer(
	// Our main server function
	function(request, response)
	{
		// Grab the URL requested by the client and parse any query options
		var url = require('url').parse(request.url, true);
		var pathfile = url.pathname;
      var query = url.query;

		// Test to see if it's a database query
		if (pathfile == '/temperature_query.json'){
         if (query.num_obs){
            var num_obs = parseInt(query.num_obs);
         }
         else{
            var num_obs = -1;
         }
         if (query.start_date){
            var start_date = query.start_date;
         }
         else{
            var start_date = '1970-01-01T00:00';
         }   
         console.log('Database query request from '+ request.connection.remoteAddress +'.');
         selectTemp(function(data){
            response.writeHead(200, { "Content-type": "application/json" });		
	         response.end(JSON.stringify(data), "ascii");
         });
      return;
      }
      

	// Test to see if it's a database query
	if (pathfile == '/temperature_angular_query.json'){
         console.log('Database query request (angular) from '+ request.connection.remoteAddress);
         selectNowTemp(function(data){
            response.writeHead(200, { "Content-type": "application/json" });		
	         response.end(JSON.stringify(data), "ascii");
         });
      return;
      }

      // Handler for favicon.ico requests
		if (pathfile == '/favicon.ico'){
			response.writeHead(200, {'Content-Type': 'image/x-icon'});
			response.end();

			// Optionally log favicon requests.
			//console.log('favicon requested');
			return;
		}


		else {
			// Print requested file to terminal
			console.log('Request from '+ request.connection.remoteAddress +' for: ' + pathfile);

			// Serve file using node-static			
			staticServer.serve(request, response, function (err, result) {
					if (err){
						// Log the error
						sys.error("Error serving " + request.url + " - " + err.message);
						
						// Respond to the client
						response.writeHead(err.status, err.headers);
						response.end('Error 404 - file not found');
						return;
						}
					return;	
					})
		}
});

// Enable server
server.listen(35008);
// Log message
console.log('Server running at http://localhost:8000');
